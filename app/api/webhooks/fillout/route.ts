export const dynamic = 'force-dynamic'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { InquiryNotification, ThankYou } from '@/emails/templates'
import { rateLimit } from '@/lib/rate-limit'
import { FilloutSchema } from '@/lib/schemas'
import { logger } from '@/lib/logger'
import { upsertLead } from '@/lib/hub/upsert-lead'
import { ingestEvent } from '@/lib/hub/ingest-event'

function getFilloutSecret(): string | null {
  const secret = process.env.FILLOUT_SECRET?.trim()
  return secret ? secret : null
}

function normalizeSignature(sig: string): string {
  const value = sig.trim()
  const idx = value.indexOf('=')
  if (idx > -1 && value.slice(0, idx).toLowerCase().includes('sha256')) {
    return value.slice(idx + 1).trim()
  }
  return value
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a, 'utf8')
  const bBuffer = Buffer.from(b, 'utf8')
  if (aBuffer.length !== bBuffer.length) return false
  return crypto.timingSafeEqual(aBuffer, bBuffer)
}

function verifySignature(rawBody: string, sig: string | null, secret: string): boolean {
  if (!sig) return false

  try {
    const normalized = normalizeSignature(sig)

    // Fillout HMAC signatures should be SHA-256 hex digests. Reject malformed input
    // before Buffer conversion so timingSafeEqual compares equal-length byte arrays.
    if (!/^[a-f0-9]{64}$/i.test(normalized)) return false

    const expected = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex')
    const expectedBuffer = Buffer.from(expected, 'hex')
    const receivedBuffer = Buffer.from(normalized, 'hex')

    if (expectedBuffer.length !== receivedBuffer.length) return false
    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  } catch {
    return false
  }
}

function verifyWebhook(req: NextRequest, rawBody: string): boolean {
  const secret = getFilloutSecret()

  if (!secret) {
    logger.error({}, 'FILLOUT_SECRET is not configured; rejecting Fillout webhook')
    return false
  }

  const sig =
    req.headers.get('x-fillout-signature') ??
    req.headers.get('x-fillout-signature-256') ??
    req.headers.get('x-webhook-signature') ??
    req.headers.get('x-hook-signature')

  if (verifySignature(rawBody, sig, secret)) return true

  // Legacy escape hatch only. Prefer HMAC signatures. Enable only if Fillout is
  // configured to send a shared bearer token instead of an HMAC signature.
  if (process.env.ALLOW_FILLOUT_BEARER_SECRET === 'true') {
    const token =
      req.headers.get('x-webhook-token') ??
      (req.headers.get('authorization')?.startsWith('Bearer ')
        ? req.headers.get('authorization')!.slice('Bearer '.length).trim()
        : null)

    if (token && timingSafeStringEqual(token, secret)) return true
  }

  return false
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'fillout')
  if (limited) return limited

  const raw = await req.text()
  if (!verifyWebhook(req, raw)) {
    logger.warn({}, 'Fillout webhook rejected')
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 })
  }

  let body: unknown = null
  try {
    body = raw ? JSON.parse(raw) : null
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const parse = FilloutSchema.safeParse(body)
  if (!parse.success) return NextResponse.json({ ok: false, error: parse.error.flatten() }, { status: 422 })

  const payload = parse.data
  const email = payload.email ?? null
  const productInterest =
    payload.product_interest ??
    payload.productInterest ??
    payload.interest_type ??
    payload.interestType ??
    'General'

  try {
    const { contact, inquiry } = await upsertLead({
      firstName: payload.first_name ?? payload.firstName ?? null,
      lastName: payload.last_name ?? payload.lastName ?? null,
      email,
      phone: payload.phone ?? null,
      county: payload.county ?? null,
      productInterest,
      leadSessionId: payload.lead_session_id ?? null,
      source: payload.utm_source ?? 'fillout',
      medium: payload.utm_medium ?? 'form',
      campaign: payload.utm_campaign ?? 'fillout',
      term: payload.utm_term ?? null,
      content: payload.utm_content ?? null,
      referrer: payload.referrer ?? null,
      landingPage: payload.page_url ?? payload.landing_page ?? null,
      notes: payload.notes ?? null,
      metadata: payload,
    })

    await ingestEvent({
      eventType: 'form_submit',
      leadSessionId: payload.lead_session_id ?? null,
      contactId: contact.id,
      inquiryId: inquiry.id,
      pageUrl: payload.page_url ?? payload.landing_page ?? null,
      referrer: payload.referrer ?? null,
      source: payload.utm_source ?? 'fillout',
      medium: payload.utm_medium ?? 'form',
      campaign: payload.utm_campaign ?? 'fillout',
      county: payload.county ?? null,
      productInterest,
      metadata: {
        provider: 'fillout',
      },
    })

    if (process.env.NOTIFY_TO && process.env.THANKYOU_FROM) {
      const subject = `New ${productInterest} lead — ${[contact.firstName, contact.lastName].filter(Boolean).join(' ') || contact.email || contact.phone || inquiry.id}`

      void sendMail({
        to: process.env.NOTIFY_TO,
        from: process.env.THANKYOU_FROM,
        subject,
        html: InquiryNotification({
          firstName: contact.firstName ?? undefined,
          lastName: contact.lastName ?? undefined,
          email: contact.email ?? undefined,
          phone: contact.phone ?? undefined,
          productInterest,
          county: contact.county ?? undefined,
          leadSessionId: payload.lead_session_id ?? undefined,
          source: payload.utm_source ?? 'fillout',
          campaign: payload.utm_campaign ?? undefined,
        }),
      })

      if (contact.email) {
        void sendMail({
          to: contact.email,
          from: process.env.THANKYOU_FROM,
          subject: "You're on the list — let's find a time",
          html: ThankYou({ firstName: contact.firstName ?? undefined }),
        })
      }
    }

    return NextResponse.json({ ok: true, contactId: contact.id, inquiryId: inquiry.id })
  } catch (err: any) {
    logger.error({ err: err.message }, 'Fillout webhook error')
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, status: 'Latimore Fillout webhook ready' })
}
