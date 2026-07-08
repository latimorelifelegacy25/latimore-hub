import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { LeadStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/ai/shared'

const ParamsSchema = z.object({
  id: z.string().uuid(),
})

const PatchBodySchema = z.object({
  status: z.nativeEnum(LeadStatus).optional(),
  notes: z.string().trim().min(1).max(5000).optional(),
}).refine((data) => data.status || data.notes, {
  message: 'At least one field (status or notes) must be provided',
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminSession(req)
    if (!auth.ok) return auth.response

    const parsedParams = ParamsSchema.safeParse(await params)
    if (!parsedParams.success) {
      return NextResponse.json({ ok: false, error: parsedParams.error.flatten() }, { status: 422 })
    }

    const body = await req.json().catch(() => null)
    const parsedBody = PatchBodySchema.safeParse(body)
    if (!parsedBody.success) {
      return NextResponse.json({ ok: false, error: parsedBody.error.flatten() }, { status: 422 })
    }

    const { status, notes } = parsedBody.data
    const updateData: { status?: LeadStatus; notesSummary?: string } = {}
    if (status) updateData.status = status
    if (notes) updateData.notesSummary = notes

    const existingContact = await prisma.contact.findUnique({
      where: { id: parsedParams.data.id },
      select: { id: true, status: true },
    })

    if (!existingContact) {
      return NextResponse.json({ ok: false, error: 'Contact not found' }, { status: 404 })
    }

    const contact = await prisma.contact.update({
      where: { id: parsedParams.data.id },
      data: updateData,
    })

    if (status && status !== existingContact.status) {
      await prisma.systemEvent.create({
        data: {
          type: 'contact.status_changed',
          contactId: contact.id,
          payload: {
            oldStatus: existingContact.status,
            newStatus: status,
          },
        },
      })
    }

    return NextResponse.json({ ok: true, contact })
  } catch (error) {
    console.error('Contact update error:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}
