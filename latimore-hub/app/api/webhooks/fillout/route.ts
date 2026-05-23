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

type FlatFilloutPayload = Record<string, unknown>

function normalizeSignature(sig: string): string {
  const value = sig.trim()
  const idx = value.indexOf('=')
  if (idx > -1 && value.slice(0, idx).toLowerCase().includes('sha256')) return value.slice(idx + 1).trim()
  return value
}

function verifySignature(rawBody: string, sig: string | null): boolean {
  const secret = process.env.FILLOUT_SECRET
  if (!secret) return true
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

function verifyWebhook(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.FILLOUT_SECRET
  if (!secret) return true

  const token =
    req.headers.get('x-webhook-token') ??
    (req.headers.get('authorization')?.startsWith('Bearer ')
      ? req.headers.get('authorization')!.slice('Bearer '.length)
      : null)

  if (token && token === secret) return true

  const sig =
    req.headers.get('x-webhook-signature') ??
    req.headers.get('x-fillout-signature') ??
    req.headers.get('x-fillout-signature-256') ??
    req.headers.get('x-hook-signature')

  return verifySignature(rawBody, sig)
}

function cleanKey(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function stringifyAnswer(value: unknown): string | null {
  if (value == null) return null
  if (Array.isArray(value)) {
    const text = value.map((item) => stringifyAnswer(item)).filter(Boolean).join(', ')
    return text || null
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    return stringifyAnswer(record.value ?? record.answer ?? record.label ?? record.name ?? record.email ?? record.phone)
  }
  const text = String(value).trim()
  return text || null
}

function pickField(payload: FlatFilloutPayload, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = stringifyAnswer(payload[key])
    if (value) return value
  }
  return null
}

function assignIfMissing(payload: FlatFilloutPayload, canonicalKey: string, value: unknown) {
  if (payload[canonicalKey] == null && value != null) payload[canonicalKey] = value
}

function flattenFilloutPayload(body: unknown): FlatFilloutPayload {
  const source = body && typeof body === 'object' ? (body as Record<string, unknown>) : {}
  const submission = source.submission && typeof source.submission === 'object' ? (source.submission as Record<string, unknown>) : {}
  const flat: FlatFilloutPayload = { ...source, ...submission }

  const possibleQuestionArrays = [
    source.questions,
    source.answers,
    source.responses,
    submission.questions,
    submission.answers,
    submission.responses,
  ]

  for (const maybeQuestions of possibleQuestionArrays) {
    if (!Array.isArray(maybeQuestions)) continue

    for (const question of maybeQuestions) {
      if (!question || typeof question !== 'object') continue
      const q = question as Record<string, unknown>
      const rawName = q.name ?? q.label ?? q.title ?? q.question ?? q.questionLabel ?? q.questionName ?? q.id
      const key = cleanKey(rawName)
      const value = q.value ?? q.answer ?? q.answers ?? q.response
      if (key && flat[key] == null) flat[key] = stringifyAnswer(value)
    }
  }

  assignIfMissing(flat, 'first_name', pickField(flat, 'first_name', 'firstname', 'first', 'first_name_required'))
  assignIfMissing(flat, 'last_name', pickField(flat, 'last_name', 'lastname', 'last', 'last_name_required'))
  assignIfMissing(flat, 'email', pickField(flat, 'email', 'email_address', 'your_email', 'contact_email'))
  assignIfMissing(flat, 'phone', pickField(flat, 'phone', 'phone_number', 'mobile', 'cell', 'telephone'))
  assignIfMissing(flat, 'county', pickField(flat, 'county', 'pa_county', 'what_county_are_you_in'))
  assignIfMissing(flat, 'product_interest', pickField(flat, 'product_interest', 'productinterest', 'interest', 'coverage_interest', 'what_are_you_interested_in'))
  assignIfMissing(flat, 'notes', pickField(flat, 'notes', 'message', 'comments', 'anything_else'))

  assignIfMissing(flat, 'utm_source', pickField(flat, 'utm_source', 'source') ?? 'pahs_stadium')
  assignIfMissing(flat, 'utm_medium', pickField(flat, 'utm_medium', 'medium') ?? 'qr')
  assignIfMissing(flat, 'utm_campaign', pickField(flat, 'utm_campaign', 'campaign') ?? 'crimson_tide_football_2026')
  assignIfMissing(flat, 'utm_content', pickField(flat, 'utm_content', 'content') ?? 'fillout_pahs')
  assignIfMissing(flat, 'landing_page', pickField(flat, 'landing_page', 'page_url') ?? 'https://latimorelifelegacy.fillout.com/pahs')

  return flat
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

  const flattened = flattenFilloutPayload(body)
  const parse = FilloutSchema.safeParse(flattened)
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
      source: payload.utm_source ?? 'pahs_stadium',
      medium: payload.utm_medium ?? 'qr',
      campaign: payload.utm_campaign ?? 'crimson_tide_football_2026',
      term: payload.utm_term ?? null,
      content: payload.utm_content ?? 'fillout_pahs',
      referrer: payload.referrer ?? null,
      landingPage: payload.page_url ?? payload.landing_page ?? 'https://latimorelifelegacy.fillout.com/pahs',
      notes: payload.notes ?? 'PAHS Football 2026 Fillout intake',
      metadata: {
        provider: 'fillout',
        campaignName: 'PAHS Football 2026',
        sourceForm: 'https://latimorelifelegacy.fillout.com/pahs',
        raw: body,
        flattened,
      },
    })

    await ingestEvent({
      eventType: 'form_submit',
      leadSessionId: payload.lead_session_id ?? null,
      contactId: contact.id,
      inquiryId: inquiry.id,
      pageUrl: payload.page_url ?? payload.landing_page ?? 'https://latimorelifelegacy.fillout.com/pahs',
      referrer: payload.referrer ?? null,
      source: payload.utm_source ?? 'pahs_stadium',
      medium: payload.utm_medium ?? 'qr',
      campaign: payload.utm_campaign ?? 'crimson_tide_football_2026',
      county: payload.county ?? null,
      productInterest,
      metadata: {
        provider: 'fillout',
        campaignName: 'PAHS Football 2026',
      },
    })

    if (process.env.NOTIFY_TO && process.env.THANKYOU_FROM) {
      const subject = `New PAHS lead — ${[contact.firstName, contact.lastName].filter(Boolean).join(' ') || contact.email || contact.phone || inquiry.id}`

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
          source: payload.utm_source ?? 'pahs_stadium',
          campaign: payload.utm_campaign ?? 'crimson_tide_football_2026',
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
  return NextResponse.json({ ok: true, status: 'Latimore Fillout webhook ready', campaign: 'PAHS Football 2026' })
}
