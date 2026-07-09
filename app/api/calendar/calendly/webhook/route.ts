export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const CalendlyWebhookSchema = z.object({
  event: z.string().optional(),
  payload: z.object({
    invitee: z.object({
      email: z.string().email().optional().nullable(),
      name: z.string().optional().nullable(),
      first_name: z.string().optional().nullable(),
      last_name: z.string().optional().nullable(),
      timezone: z.string().optional().nullable(),
      questions_and_answers: z.array(z.object({
        question: z.string().optional().nullable(),
        answer: z.string().optional().nullable(),
      }).passthrough()).optional().default([]),
    }).passthrough().optional().default({}),
    event: z.object({
      uri: z.string().optional().nullable(),
      name: z.string().optional().nullable(),
      start_time: z.string().datetime().optional().nullable(),
      end_time: z.string().datetime().optional().nullable(),
      location: z.any().optional().nullable(),
    }).passthrough().optional().default({}),
  }).passthrough().optional().default({}),
}).passthrough()

function verifyWebhookSecret(req: NextRequest): boolean {
  const secret = process.env.CALENDLY_WEBHOOK_SECRET?.trim()
  if (!secret) {
    console.error('CALENDLY_WEBHOOK_SECRET is not configured; rejecting Calendly webhook')
    return false
  }

  const provided = req.headers.get('x-webhook-secret') ?? req.headers.get('x-calendly-webhook-secret') ?? ''
  return provided === secret
}

function normalizePhone(phone?: string | null) {
  if (!phone) return null
  const digits = phone.replace(/[^\d+]/g, '')
  return digits || null
}

function parseInvitee(payload: z.infer<typeof CalendlyWebhookSchema>) {
  const outer = payload.payload ?? {}
  const invitee = outer.invitee ?? {}
  const event = outer.event ?? {}
  const questions = invitee.questions_and_answers ?? []

  const phoneAnswer = questions.find((item) => String(item?.question ?? '').toLowerCase().includes('phone'))?.answer ?? null

  return {
    email: invitee.email ?? null,
    name: invitee.name ?? null,
    firstName: invitee.first_name ?? null,
    lastName: invitee.last_name ?? null,
    phone: normalizePhone(phoneAnswer),
    eventUri: event.uri ?? null,
    eventName: event.name ?? 'Calendly Meeting',
    startTime: event.start_time ?? null,
    endTime: event.end_time ?? null,
    status: payload.event === 'invitee.canceled' ? 'cancelled' : 'scheduled',
    timezone: invitee.timezone ?? null,
    meetingUrl: event.location && typeof event.location === 'object' && 'join_url' in event.location ? String(event.location.join_url) : null,
    location: event.location && typeof event.location === 'object' && 'type' in event.location ? String(event.location.type) : null,
    rawPayload: payload,
  }
}

export async function POST(req: NextRequest) {
  if (!verifyWebhookSecret(req)) {
    return NextResponse.json({ ok: false, error: 'invalid secret' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parse = CalendlyWebhookSchema.safeParse(body)
  if (!parse.success) return NextResponse.json({ ok: false, error: parse.error.flatten() }, { status: 422 })

  try {
    const invitee = parseInvitee(parse.data)
    if (!invitee.email && !invitee.phone) {
      return NextResponse.json({ ok: false, error: 'Calendly payload missing contact identity' }, { status: 422 })
    }

    let contact = await prisma.contact.findFirst({
      where: { OR: [invitee.email ? { email: invitee.email } : undefined, invitee.phone ? { phone: invitee.phone } : undefined].filter(Boolean) as any },
      include: { inquiries: { orderBy: { updatedAt: 'desc' }, take: 1 } },
    })

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          email: invitee.email ?? undefined,
          phone: invitee.phone ?? undefined,
          fullName: invitee.name ?? undefined,
          firstName: invitee.firstName ?? undefined,
          lastName: invitee.lastName ?? undefined,
          lastActivityAt: new Date(),
          primarySource: 'Calendly',
          primaryMedium: 'Scheduling',
        },
        include: { inquiries: true },
      })
    }

    let inquiry = contact.inquiries[0] ?? null
    if (!inquiry) {
      inquiry = await prisma.inquiry.create({
        data: { contactId: contact.id, stage: 'Booked', source: 'Calendly', medium: 'Scheduling', notes: 'Inquiry created from Calendly booking webhook.' },
      })
    } else if (inquiry.stage !== 'Sold') {
      inquiry = await prisma.inquiry.update({ where: { id: inquiry.id }, data: { stage: 'Booked' } })
    }

    const appointment = await prisma.appointment.create({
      data: {
        contactId: contact.id,
        inquiryId: inquiry.id,
        bookingSource: 'Calendly',
        source: 'Calendly',
        medium: 'Scheduling',
        scheduledFor: invitee.startTime ? new Date(invitee.startTime) : undefined,
        status: invitee.status === 'cancelled' ? 'Cancelled' : 'Booked',
        location: invitee.location ?? undefined,
        calendlyEventId: invitee.eventUri ?? undefined,
        metadata: invitee.rawPayload,
      },
    })

    const calendarEvent = await prisma.calendarEvent.create({
      data: {
        contactId: contact.id,
        inquiryId: inquiry.id,
        appointmentId: appointment.id,
        provider: 'calendly',
        externalId: invitee.eventUri ?? undefined,
        title: invitee.eventName,
        description: 'Calendly event synced into Latimore Hub OS.',
        startAt: invitee.startTime ? new Date(invitee.startTime) : new Date(),
        endAt: invitee.endTime ? new Date(invitee.endTime) : undefined,
        timezone: invitee.timezone ?? undefined,
        location: invitee.location ?? undefined,
        meetingUrl: invitee.meetingUrl ?? undefined,
        status: invitee.status === 'cancelled' ? 'cancelled' : 'scheduled',
        payload: invitee.rawPayload,
      },
    })

    await prisma.task.create({
      data: {
        contactId: contact.id,
        inquiryId: inquiry.id,
        title: invitee.status === 'cancelled' ? 'Reschedule cancelled appointment' : 'Prepare for booked appointment',
        description: invitee.status === 'cancelled' ? 'Follow up to reschedule the cancelled Calendly meeting.' : 'Review contact history and prepare talking points before the meeting.',
        status: 'Open',
        dueAt: invitee.startTime ? new Date(invitee.startTime) : undefined,
      },
    })

    await prisma.contact.update({
      where: { id: contact.id },
      data: { lastActivityAt: new Date(), nextFollowUpAt: invitee.startTime && invitee.status !== 'cancelled' ? new Date(invitee.startTime) : new Date() },
    })

    await prisma.systemEvent.create({
      data: {
        type: invitee.status === 'cancelled' ? 'calendar.calendly.booking_cancelled' : 'calendar.calendly.booking_created',
        contactId: contact.id,
        inquiryId: inquiry.id,
        payload: { appointmentId: appointment.id, calendarEventId: calendarEvent.id, calendlyEventUri: invitee.eventUri, status: invitee.status },
        source: 'Calendly',
        medium: 'Scheduling',
      },
    })

    return NextResponse.json({ ok: true, contactId: contact.id, inquiryId: inquiry.id, appointmentId: appointment.id, calendarEventId: calendarEvent.id })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Calendly webhook failed' }, { status: 500 })
  }
}
