export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { BookingNotifySchema } from '@/lib/schemas'
import { logger } from '@/lib/logger'
import { recordAppointment } from '@/lib/hub/record-appointment'

type GenericRecord = Record<string, any>

function getQueryToken(req: NextRequest): string {
  return req.nextUrl.searchParams.get('token') ?? ''
}

function verifyWebhookSecret(req: NextRequest): boolean {
  const secret = process.env.BOOKING_WEBHOOK_SECRET
  if (!secret) return true
  const provided =
    req.headers.get('x-booking-secret') ??
    req.headers.get('x-webhook-secret') ??
    req.headers.get('x-webhook-token') ??
    getQueryToken(req) ??
    ''
  return provided === secret
}

function pickString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return null
}

function normalizeBody(body: unknown): GenericRecord {
  const root = (body && typeof body === 'object' ? body : {}) as GenericRecord
  const data = (root.data && typeof root.data === 'object' ? root.data : {}) as GenericRecord
  const fields = (root.fields && typeof root.fields === 'object' ? root.fields : {}) as GenericRecord
  const submission = (root.submission && typeof root.submission === 'object' ? root.submission : {}) as GenericRecord

  return {
    inquiryId: pickString(root.inquiryId, data.inquiryId, fields.inquiryId, submission.inquiryId),
    lead_session_id: pickString(
      root.lead_session_id,
      root.leadSessionId,
      data.lead_session_id,
      data.leadSessionId,
      fields.lead_session_id,
      fields.leadSessionId,
      submission.lead_session_id,
      submission.leadSessionId
    ),
    gcal_id: pickString(root.gcal_id, root.gcalId, data.gcal_id, data.gcalId),
    scheduled_for: pickString(root.scheduled_for, root.scheduledFor, root.start_at, root.startAt, data.scheduled_for, data.scheduledFor, data.start_at, data.startAt),
    start_at: pickString(root.start_at, root.startAt, data.start_at, data.startAt),
    end_at: pickString(root.end_at, root.endAt, data.end_at, data.endAt),
    booking_source: pickString(root.booking_source, root.bookingSource, data.booking_source, data.bookingSource, 'booking_webhook'),
    source: pickString(root.source, data.source),
    medium: pickString(root.medium, data.medium),
    campaign: pickString(root.campaign, data.campaign),
    location: pickString(root.location, data.location),
  }
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'booking')
  if (limited) return limited

  if (!verifyWebhookSecret(req)) {
    logger.warn({}, 'Booking webhook rejected')
    return NextResponse.json({ ok: false, error: 'invalid secret' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const normalized = normalizeBody(body)
  const parse = BookingNotifySchema.safeParse(normalized)
  if (!parse.success) {
    return NextResponse.json(
      {
        ok: false,
        error: parse.error.flatten(),
        receivedKeys: body && typeof body === 'object' ? Object.keys(body as GenericRecord) : [],
      },
      { status: 422 }
    )
  }

  try {
    const result = await recordAppointment({
      inquiryId: parse.data.inquiryId ?? null,
      leadSessionId: parse.data.lead_session_id ?? null,
      gcalId: parse.data.gcal_id ?? null,
      scheduledFor: parse.data.scheduled_for ?? parse.data.start_at ?? null,
      endAt: parse.data.end_at ?? null,
      bookingSource: parse.data.booking_source ?? 'booking_webhook',
      source: parse.data.source ?? null,
      medium: parse.data.medium ?? null,
      campaign: parse.data.campaign ?? null,
      location: parse.data.location ?? null,
    })

    return NextResponse.json({ ok: true, inquiryId: result.inquiry.id, appointmentId: result.appointment.id })
  } catch (err: any) {
    logger.error({ err: err.message }, 'Booking webhook error')
    const status = /No matching inquiry/i.test(err.message) ? 404 : 500
    return NextResponse.json({ ok: false, error: status === 404 ? 'no matching inquiry' : 'server error' }, { status })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, status: 'Latimore booking webhook ready' })
}
