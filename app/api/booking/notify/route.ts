import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { BookingNotifySchema } from '@/lib/schemas'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'booking')
  if (limited) return limited

  const body = await req.json().catch(() => null)
  const parse = BookingNotifySchema.safeParse(body)
  if (!parse.success) return NextResponse.json({ ok: false, error: parse.error.flatten() }, { status: 422 })

  const { lead_session_id, gcal_id, start_at, end_at } = parse.data

  try {
    const inquiry = await prisma.inquiry.findFirst({ where: { leadSessionId: lead_session_id } })
    if (!inquiry) return NextResponse.json({ ok: false, error: 'no matching inquiry' }, { status: 404 })

    await prisma.inquiry.update({ where: { id: inquiry.id }, data: { status: 'Booked' } })
    await prisma.appointment.create({
      data: {
        contactId: inquiry.contactId,
        inquiryId: inquiry.id,
        gcalId:    gcal_id  ?? undefined,
        startAt:   start_at ? new Date(start_at) : undefined,
        endAt:     end_at   ? new Date(end_at)   : undefined,
      },
    })

    logger.info({ inquiryId: inquiry.id }, 'Inquiry marked Booked')
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    logger.error({ err: err.message }, 'Booking notify error')
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 })
  }
}
