export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AiRunStatus, AiRunType } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { createOpenAIJsonCompletion } from '@/lib/ai/client'
import { completeAiRun, createAiRun, createSystemAiEvent } from '@/lib/ai/shared'
import { ingestEvent } from '@/lib/hub/ingest-event'
import { upsertLead } from '@/lib/hub/upsert-lead'

const NormalizedIntakeSchema = z
  .object({
    firstName: z.string().max(100).nullable().optional(),
    lastName: z.string().max(100).nullable().optional(),
    fullName: z.string().max(200).nullable().optional(),
    email: z.string().email().nullable().optional(),
    phone: z.string().min(7).max(40).nullable().optional(),
    county: z.string().max(100).nullable().optional(),
    productInterest: z.string().max(120).nullable().optional(),
    message: z.string().max(4000).nullable().optional(),
    leadSessionId: z.string().max(191).nullable().optional(),
    landingPage: z.string().max(500).nullable().optional(),
    referrer: z.string().max(500).nullable().optional(),
    source: z.string().max(100).nullable().optional(),
    medium: z.string().max(100).nullable().optional(),
    campaign: z.string().max(150).nullable().optional(),
    term: z.string().max(100).nullable().optional(),
    content: z.string().max(100).nullable().optional(),
  })
  .refine((value) => Boolean(value.email || value.phone), {
    message: 'Either email or phone is required for AI intake.',
    path: ['email'],
  })

type NormalizedIntake = z.infer<typeof NormalizedIntakeSchema>

type AiIntakeOutput = {
  leadSummary: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  productFit: string
  painPoint: string
  nextBestAction: string
  followUpText: string
  followUpEmailSubject: string
  followUpEmailBody: string
  complianceNotes: string[]
  urgencyReasons: string[]
}

const aiIntakeSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    leadSummary: { type: 'string' },
    priority: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] },
    productFit: { type: 'string' },
    painPoint: { type: 'string' },
    nextBestAction: { type: 'string' },
    followUpText: { type: 'string' },
    followUpEmailSubject: { type: 'string' },
    followUpEmailBody: { type: 'string' },
    complianceNotes: { type: 'array', items: { type: 'string' } },
    urgencyReasons: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'leadSummary',
    'priority',
    'productFit',
    'painPoint',
    'nextBestAction',
    'followUpText',
    'followUpEmailSubject',
    'followUpEmailBody',
    'complianceNotes',
    'urgencyReasons',
  ],
}

function clean(value: unknown, max = 255): string | null {
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') return null
  const text = String(value).trim()
  if (!text) return null
  return text.slice(0, max)
}

function keyName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function addField(fields: Record<string, string>, key: string, value: unknown) {
  const normalizedKey = keyName(key)
  const normalizedValue = clean(value, 4000)
  if (!normalizedKey || !normalizedValue) return
  if (!fields[normalizedKey]) fields[normalizedKey] = normalizedValue
}

function valueFromLabeledObject(value: Record<string, unknown>): { label: string; answer: unknown } | null {
  const label =
    clean(value.label) ??
    clean(value.name) ??
    clean(value.title) ??
    clean(value.question) ??
    clean(value.key) ??
    clean(value.id)

  const answer =
    value.value ??
    value.answer ??
    value.response ??
    value.text ??
    value.email ??
    value.phone ??
    value.selection ??
    value.choice

  return label ? { label, answer } : null
}

function collectFields(value: unknown, fields: Record<string, string>, keyHint?: string) {
  if (Array.isArray(value)) {
    for (const item of value) collectFields(item, fields, keyHint)
    return
  }

  if (!value || typeof value !== 'object') {
    if (keyHint) addField(fields, keyHint, value)
    return
  }

  const record = value as Record<string, unknown>
  const labeled = valueFromLabeledObject(record)
  if (labeled) addField(fields, labeled.label, labeled.answer)

  for (const [key, item] of Object.entries(record)) {
    if (!item || typeof item !== 'object') {
      addField(fields, key, item)
    } else {
      collectFields(item, fields, key)
    }
  }
}

function pick(fields: Record<string, string>, keys: string[]): string | null {
  for (const key of keys) {
    const value = fields[keyName(key)]
    if (value) return value
  }
  return null
}

function splitName(fullName?: string | null) {
  const parts = clean(fullName, 200)?.split(/\s+/).filter(Boolean) ?? []
  if (parts.length === 0) return { firstName: null, lastName: null }
  if (parts.length === 1) return { firstName: parts[0], lastName: null }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function normalizePayload(body: unknown) {
  const fields: Record<string, string> = {}
  collectFields(body, fields)

  const fullName = pick(fields, ['fullName', 'full name', 'name', 'your name', 'client name'])
  const nameParts = splitName(fullName)

  const normalized: NormalizedIntake = {
    firstName: pick(fields, ['firstName', 'first name', 'given name']) ?? nameParts.firstName,
    lastName: pick(fields, ['lastName', 'last name', 'surname', 'family name']) ?? nameParts.lastName,
    fullName,
    email: pick(fields, ['email', 'email address', 'client email']),
    phone: pick(fields, ['phone', 'phone number', 'mobile', 'cell', 'client phone']),
    county: pick(fields, ['county', 'pa county', 'location', 'service area']),
    productInterest: pick(fields, ['productInterest', 'product interest', 'product', 'coverage type', 'insurance need', 'interest']),
    message: pick(fields, ['message', 'notes', 'additional notes', 'comments', 'goal', 'goals', 'what can we help with']),
    leadSessionId: pick(fields, ['leadSessionId', 'lead session id', 'session id']),
    landingPage: pick(fields, ['landingPage', 'landing page', 'pageUrl', 'page url', 'url']),
    referrer: pick(fields, ['referrer', 'referer']),
    source: pick(fields, ['utm_source', 'utm source', 'source']) ?? 'auto-form',
    medium: pick(fields, ['utm_medium', 'utm medium', 'medium']) ?? 'form',
    campaign: pick(fields, ['utm_campaign', 'utm campaign', 'campaign']) ?? 'ai-intake',
    term: pick(fields, ['utm_term', 'utm term', 'term']),
    content: pick(fields, ['utm_content', 'utm content', 'content']),
  }

  return { normalized, fieldKeys: Object.keys(fields).sort() }
}

function buildLeadNotes(input: NormalizedIntake) {
  return [
    'AI Intake Form Submission',
    '',
    `Name: ${input.fullName ?? [input.firstName, input.lastName].filter(Boolean).join(' ') || 'Not provided'}`,
    `Email: ${input.email ?? 'Not provided'}`,
    `Phone: ${input.phone ?? 'Not provided'}`,
    `County: ${input.county ?? 'Not provided'}`,
    `Product Interest: ${input.productInterest ?? 'General'}`,
    '',
    input.message ? `Message: ${input.message}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}

function leadScoreFromPriority(priority: AiIntakeOutput['priority']) {
  if (priority === 'HIGH') return 85
  if (priority === 'MEDIUM') return 55
  return 25
}

function buildAiNote(output: AiIntakeOutput) {
  return [
    `Priority: ${output.priority}`,
    `Product Fit: ${output.productFit}`,
    `Pain Point: ${output.painPoint}`,
    `Next Best Action: ${output.nextBestAction}`,
    '',
    'Lead Summary:',
    output.leadSummary,
    '',
    'SMS Follow-Up:',
    output.followUpText,
    '',
    'Email Follow-Up:',
    `Subject: ${output.followUpEmailSubject}`,
    output.followUpEmailBody,
    '',
    'Compliance Notes:',
    ...output.complianceNotes.map((note) => `- ${note}`),
    '',
    'Urgency Reasons:',
    ...output.urgencyReasons.map((reason) => `- ${reason}`),
  ].join('\n')
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

function jsonRecord(value: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'fillout')
  if (limited) return limited

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 })

  const { normalized, fieldKeys } = normalizePayload(body)
  const parsed = NormalizedIntakeSchema.safeParse(normalized)

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 422 })
  }

  const input = parsed.data
  const safeInput = jsonRecord(input as Record<string, unknown>)
  let aiRunId: string | undefined

  try {
    await prisma.systemEvent.create({
      data: {
        type: 'intake.form_received',
        leadSessionId: input.leadSessionId ?? undefined,
        source: input.source ?? 'auto-form',
        medium: input.medium ?? 'form',
        campaign: input.campaign ?? 'ai-intake',
        payload: {
          form: 'ai-intake',
          fieldKeys,
          hasEmail: Boolean(input.email),
          hasPhone: Boolean(input.phone),
          productInterest: input.productInterest ?? 'General',
        } as Prisma.InputJsonValue,
      },
    })

    const { contact, inquiry } = await upsertLead({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      county: input.county,
      productInterest: input.productInterest,
      leadSessionId: input.leadSessionId,
      source: input.source ?? 'auto-form',
      medium: input.medium ?? 'form',
      campaign: input.campaign ?? 'ai-intake',
      term: input.term,
      content: input.content,
      referrer: input.referrer,
      landingPage: input.landingPage,
      notes: buildLeadNotes(input),
      metadata: {
        form: 'ai-intake',
        fieldKeys,
        normalizedInput: safeInput,
      },
    })

    await ingestEvent({
      eventType: 'form_submit',
      leadSessionId: input.leadSessionId,
      contactId: contact.id,
      inquiryId: inquiry.id,
      pageUrl: input.landingPage,
      referrer: input.referrer,
      source: input.source ?? 'auto-form',
      medium: input.medium ?? 'form',
      campaign: input.campaign ?? 'ai-intake',
      county: input.county,
      productInterest: input.productInterest,
      metadata: { form: 'ai-intake', fieldKeys },
    })

    await prisma.systemEvent.create({
      data: {
        type: 'intake.lead_saved',
        contactId: contact.id,
        inquiryId: inquiry.id,
        leadSessionId: input.leadSessionId ?? undefined,
        source: input.source ?? 'auto-form',
        medium: input.medium ?? 'form',
        campaign: input.campaign ?? 'ai-intake',
        payload: {
          form: 'ai-intake',
          contactId: contact.id,
          inquiryId: inquiry.id,
        } as Prisma.InputJsonValue,
      },
    })

    if (!process.env.OPENAI_API_KEY) {
      await createSystemAiEvent({
        type: 'ai.intake.skipped',
        contactId: contact.id,
        inquiryId: inquiry.id,
        payload: {
          reason: 'missing_openai_api_key',
          form: 'ai-intake',
        },
      })

      return NextResponse.json({
        ok: true,
        aiOk: false,
        contactId: contact.id,
        inquiryId: inquiry.id,
        tracking: {
          events: ['intake.form_received', 'lead_created', 'form_submit', 'intake.lead_saved', 'ai.intake.skipped'],
        },
      })
    }

    const aiRun = await createAiRun({
      type: AiRunType.lead_score,
      contactId: contact.id,
      inquiryId: inquiry.id,
      input: {
        form: 'ai-intake',
        normalizedInput: safeInput,
      },
    })
    aiRunId = aiRun.id

    const startedAt = Date.now()
    const completion = await createOpenAIJsonCompletion<AiIntakeOutput>({
      system:
        'You are the Latimore Life & Legacy AI intake analyst. Analyze insurance, retirement, annuity, final expense, family protection, and business protection leads. Keep recommendations factual, compliant, and advisor-ready. Do not use fear tactics, do not guarantee outcomes, do not imply coverage is approved, and do not make unsupported financial claims.',
      user: JSON.stringify({
        task: 'Analyze this new auto-form intake and generate advisor follow-up material.',
        lead: safeInput,
      }),
      schemaName: 'latimore_ai_intake',
      schema: aiIntakeSchema,
      temperature: 0.25,
    })

    const leadScore = leadScoreFromPriority(completion.output.priority)
    const aiNote = buildAiNote(completion.output)

    await Promise.all([
      prisma.contact.update({
        where: { id: contact.id },
        data: {
          leadScore,
          notesSummary: completion.output.leadSummary,
          lastActivityAt: new Date(),
        },
      }),
      prisma.inquiry.update({
        where: { id: inquiry.id },
        data: {
          leadScore,
          notes: [inquiry.notes, aiNote].filter(Boolean).join('\n\n--- AI Intake Analysis ---\n'),
        },
      }),
      prisma.note.create({
        data: {
          contactId: contact.id,
          inquiryId: inquiry.id,
          title: `AI Intake Analysis - ${completion.output.priority}`,
          body: aiNote,
          author: 'ai-intake',
          isPinned: completion.output.priority === 'HIGH',
        },
      }),
    ])

    await completeAiRun({
      aiRunId,
      output: {
        form: 'ai-intake',
        contactId: contact.id,
        inquiryId: inquiry.id,
        leadScore,
        analysis: completion.output,
      },
      model: completion.model,
      tokensInput: completion.usage?.input_tokens,
      tokensOutput: completion.usage?.output_tokens,
      latencyMs: Date.now() - startedAt,
    })

    await createSystemAiEvent({
      type: 'ai.intake.completed',
      contactId: contact.id,
      inquiryId: inquiry.id,
      payload: {
        form: 'ai-intake',
        aiRunId,
        leadScore,
        priority: completion.output.priority,
        nextBestAction: completion.output.nextBestAction,
      },
    })

    return NextResponse.json({
      ok: true,
      aiOk: true,
      contactId: contact.id,
      inquiryId: inquiry.id,
      aiRunId,
      priority: completion.output.priority,
      leadScore,
      nextBestAction: completion.output.nextBestAction,
      followUpText: completion.output.followUpText,
      followUpEmailSubject: completion.output.followUpEmailSubject,
      followUpEmailBody: completion.output.followUpEmailBody,
      tracking: {
        events: ['intake.form_received', 'lead_created', 'form_submit', 'intake.lead_saved', 'ai.intake.completed'],
      },
    })
  } catch (error) {
    const message = errorMessage(error)
    logger.error({ error }, 'AI intake route failed')

    if (aiRunId) {
      try {
        await prisma.aiRun.update({
          where: { id: aiRunId },
          data: { status: AiRunStatus.failed, error: message },
        })
      } catch (updateError) {
        logger.error({ updateError, aiRunId }, 'Failed updating AI intake run after error')
      }
    }

    try {
      await prisma.systemEvent.create({
        data: {
          type: 'intake.route_failed',
          source: normalized.source ?? 'auto-form',
          medium: normalized.medium ?? 'form',
          campaign: normalized.campaign ?? 'ai-intake',
          payload: {
            form: 'ai-intake',
            error: message,
            aiRunId: aiRunId ?? null,
          } as Prisma.InputJsonValue,
        },
      })
    } catch (eventError) {
      logger.error({ eventError }, 'Failed creating intake failure tracking event')
    }

    return NextResponse.json({ ok: false, error: 'AI intake failed.', detail: message }, { status: 500 })
  }
}
