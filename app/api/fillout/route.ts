export const dynamic = 'force-dynamic'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'
import { InquiryNotification, ThankYou } from '@/emails/templates'
import { rateLimit } from '@/lib/rate-limit'
import { FilloutSchema } from '@/lib/schemas'
import { logger } from '@/lib/logger'

function normalizeSignature(sig: string): string {
  const s = sig.trim()
  const idx = s.indexOf('=')
  if (idx > -1 && s.slice(0, idx).toLowerCase().includes('sha256')) return s.slice(idx + 1).trim()
  return s
}

function verifySignature(rawBody: string, sig: string | null): boolean {
  const secret = process.env.FILLOUT_SECRET
  if (!secret) return true // skip in dev
  if (!sig) return false
  try {
    const normalized = normalizeSignature(sig)
    const hmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
    if (hmac.length !== normalized.length) return false
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(normalized))
  } catch {
    return false
  }
}


export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'fillout')
  if (limited) return limited

  const raw = await req.text()
  const sig = req.headers.get('x-webhook-signature') ?? req.headers.get('x-fillout-signature') ?? req.headers.get('x-hook-signature')

  if (!verifySignature(raw, sig)) {
    logger.warn({ sig: !!sig }, 'Fillout: invalid signature')
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 })
  }

  let body: unknown
  try { body = JSON.parse(raw) } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON' }, { status: 400 })
  }

  const root = body as any
  const rawAnswers = root.answers ?? root.submission?.answers ?? root.submission ?? root
  const parse = FilloutSchema.safeParse(rawAnswers)
  if (!parse.success) {
    logger.warn({ errors: parse.error.flatten() }, 'Fillout: validation failed')
    return NextResponse.json({ ok: false, error: 'validation failed' }, { status: 422 })
  }

  const f = parse.data
  const email = f.email.trim().toLowerCase()

  const contactData = {
    firstName:     f.first_name   ?? f.firstName   ?? null,
    lastName:      f.last_name    ?? f.lastName     ?? null,
    phone:         f.phone        ?? null,
    county:        f.county       ?? null,
    leadSessionId: f.lead_session_id ?? null,
    utmSource:     f.utm_source   ?? null,
    utmMedium:     f.utm_medium   ?? null,
    utmCampaign:   f.utm_campaign ?? null,
    utmTerm:       f.utm_term     ?? null,
    utmContent:    f.utm_content  ?? null,
    referrer:      f.referrer     ?? null,
  }

  try {
    const contact = await prisma.contact.upsert({
      where: { email },
      update: contactData,
      create: { email, ...contactData },
    })

    const interestType = (f.interest_type ?? f.interestType ?? 'Velocity') as 'Velocity' | 'Depth' | 'Group'

    const inquiry = await prisma.inquiry.create({
      data: {
        contactId:     contact.id,
        interestType,
        status:        'New_Inquiry',
        source:        'Fillout',
        leadSessionId: f.lead_session_id ?? null,
      },
    })

    await prisma.task.create({
      data: {
        title:     `Follow up with ${[contact.firstName, contact.lastName].filter(Boolean).join(' ') || email}`,
        dueAt:     new Date(Date.now() + 24 * 60 * 60 * 1000),
        inquiryId: inquiry.id,
        contactId: contact.id,
      },
    })

    if (process.env.NOTIFY_TO && process.env.THANKYOU_FROM) {
      const notifySubject = `New ${interestType} Inquiry — ${[contact.firstName, contact.lastName].filter(Boolean).join(' ') || email}`

      void sendMail({
        to:      process.env.NOTIFY_TO,
        from:    process.env.THANKYOU_FROM,
        subject: notifySubject,
        html:    InquiryNotification({ firstName: contact.firstName ?? undefined, lastName: contact.lastName ?? undefined, email, phone: contact.phone ?? undefined, interestType, county: contact.county ?? undefined, leadSessionId: contact.leadSessionId ?? undefined }),
      }).then(r => prisma.emailLog.create({ data: { toAddr: process.env.NOTIFY_TO!, fromAddr: process.env.THANKYOU_FROM!, subject: notifySubject, template: 'InquiryNotification', status: r.ok ? 'sent' : 'failed', error: r.error } }).catch(() => {}))

      void sendMail({
        to:      email,
        from:    process.env.THANKYOU_FROM,
        subject: "You're on the list — let's find a time",
        html:    ThankYou({ firstName: contact.firstName ?? undefined }),
      }).then(r => prisma.emailLog.create({ data: { toAddr: email, fromAddr: process.env.THANKYOU_FROM!, subject: "consultation", template: 'ThankYou', status: r.ok ? 'sent' : 'failed', error: r.error } }).catch(() => {}))
    }

    logger.info({ email, inquiryId: inquiry.id, interestType }, 'New inquiry created')
    return NextResponse.json({ ok: true, inquiryId: inquiry.id })

  } catch (err: any) {
    logger.error({ err: err.message }, 'Fillout: DB error')
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 })
  }
}
