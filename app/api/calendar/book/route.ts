import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/ai/shared'

const CalendarBookSchema = z.object({
  contactId: z.string().min(1),
  inquiryId: z.string().min(1).optional().nullable(),
  title: z.string().min(1).max(200),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional().nullable(),
  meetingUrl: z.string().url().optional().nullable(),
  timezone: z.string().max(100).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
})

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  try {
    const body = await req.json().catch(() => null)
    const parsed = CalendarBookSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid calendar booking payload', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const input = parsed.data
    const startAt = new Date(input.startAt)
    const endAt = input.endAt ? new Date(input.endAt) : undefined

    if (endAt && endAt <= startAt) {
      return NextResponse.json({ ok: false, error: 'endAt must be after startAt' }, { status: 422 })
    }

    const event = await prisma.calendarEvent.create({
      data: {
        contactId: input.contactId,
        inquiryId: input.inquiryId ?? undefined,
        provider: 'manual',
        title: input.title,
        startAt,
        endAt,
        meetingUrl: input.meetingUrl ?? undefined,
        timezone: input.timezone ?? undefined,
        location: input.location ?? undefined,
        status: 'scheduled',
      },
    })

    await prisma.systemEvent.create({
      data: {
        type: 'calendar.manual.booked',
        contactId: input.contactId,
        inquiryId: input.inquiryId ?? undefined,
        payload: { eventId: event.id },
      },
    })

    return NextResponse.json({ ok: true, event })
  } catch (error) {
    console.error('Manual calendar booking failed:', error)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
