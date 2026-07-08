/**
 * POST /api/admin/ai/client-snapshot
 * Generate an AI-powered snapshot/brief of a client based on their notes and context
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createOpenAIJsonCompletion } from '@/lib/ai/client'
import { requireAdminSession } from '@/lib/ai/shared'
import { prisma } from '@/lib/prisma'

const CLIENT_SNAPSHOT_NOTE_LIMIT = 20

const ClientSnapshotRequestSchema = z.object({
  contactId: z.string().min(1).optional().nullable(),
  notes: z.string().max(10_000).optional().nullable(),
  household: z.string().max(200).optional().nullable(),
}).refine((value) => Boolean(value.contactId || value.notes), {
  message: 'Either contactId or notes is required',
  path: ['contactId'],
})

const SNAPSHOT_SCHEMA = {
  type: 'object' as const,
  properties: {
    whoTheyAre: {
      type: 'string',
      description: 'One-sentence essence of the client',
    },
    familyContext: {
      type: 'array',
      items: { type: 'string' },
      description: 'Bullet points about family situation',
    },
    financialPicture: {
      type: 'array',
      items: { type: 'string' },
      description: 'Key financial observations',
    },
    topGoals: {
      type: 'array',
      items: { type: 'string' },
      description: 'Main objectives for this client',
    },
    riskThemes: {
      type: 'array',
      items: { type: 'string' },
      description: 'Identified risks or concerns',
    },
    summary: {
      type: 'string',
      description: 'Executive summary (2-3 sentences) for the call',
    },
  },
  required: ['whoTheyAre', 'familyContext', 'financialPicture', 'topGoals', 'riskThemes', 'summary'],
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  try {
    const body = await req.json().catch(() => null)
    const parsed = ClientSnapshotRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid client snapshot payload', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const { contactId, notes, household } = parsed.data
    let clientInfo = { notes: '', household: '', email: '' }

    // Fetch from DB if contactId provided
    if (contactId) {
      const contact = await prisma.contact.findUnique({
        where: { id: contactId },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          notes: {
            select: { body: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: CLIENT_SNAPSHOT_NOTE_LIMIT,
          },
        },
      })
      if (!contact) {
        return NextResponse.json({ ok: false, error: 'Contact not found' }, { status: 404 })
      }
      clientInfo = {
        notes: contact.notes?.map((note) => note.body).join('\n\n') || '',
        household: `${contact.firstName} ${contact.lastName}`.trim(),
        email: contact.email || '',
      }
    } else {
      clientInfo = { notes: notes ?? '', household: household ?? '', email: '' }
    }

    const systemPrompt = `You are a legacy planning consultant assistant for Latimore Life & Legacy LLC.
Your role is to rapidly synthesize client information into actionable insights for Jackson's sales calls.
Focus on family protection, legacy planning, and insurance solutions appropriate for Central PA.
Be empathetic, practical, and solution-oriented.`

    const userPrompt = `Client Context:
Household: ${clientInfo.household}
Email: ${clientInfo.email}
Notes: ${clientInfo.notes || '(No notes provided yet)'}

Generate a quick client snapshot to prepare for this conversation.`

    const result = await createOpenAIJsonCompletion({
      system: systemPrompt,
      user: userPrompt,
      schemaName: 'ClientSnapshot',
      schema: SNAPSHOT_SCHEMA,
      temperature: 0.7,
    })

    return NextResponse.json({ ok: true, snapshot: result.output })
  } catch (error) {
    console.error('Client snapshot error:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to generate snapshot' },
      { status: 500 }
    )
  }
}
