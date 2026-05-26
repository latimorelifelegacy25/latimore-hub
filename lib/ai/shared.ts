/**
 * lib/ai/shared.ts
 *
 * FIX: requireAdminSession had no cron secret bypass.
 * Every cron job calling an AI route was getting a 401 because
 * cron requests have no session cookie — only an x-cron-secret header.
 *
 * Added requireCronAuth() and updated requireAdminSession() to
 * accept cron secret as an alternative to a session.
 */

import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { AiRunStatus, AiRunType } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import type { Prisma } from '@prisma/client'

/**
 * Require an admin session OR a valid cron secret.
 * Use this on any route that cron jobs need to call directly.
 */
export async function requireAdminSession(req?: NextRequest) {
  // Allow cron jobs through with the cron secret
  if (req) {
    const cronSecret = process.env.CRON_SECRET
    const cronHeader =
      req.headers.get('x-cron-secret') ??
      req.headers.get('authorization')?.replace('Bearer ', '')
    if (cronSecret && cronHeader === cronSecret) {
      return { ok: true as const, session: null, isCron: true }
    }
  }

  // Allow bypass in dev/test
  if (process.env.DISABLE_ADMIN_AUTH === 'true') {
    return { ok: true as const, session: null, isCron: false }
  }

  const session = await getServerSession(authOptions)
  if (!session) {
    return {
      ok: false as const,
      response: NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 }),
    }
  }
  return { ok: true as const, session, isCron: false }
}

/**
 * Use on cron-only routes (GET handlers triggered by Vercel cron).
 * Returns a 401 response if the secret is wrong, null if valid.
 */
export function requireCronAuth(req: NextRequest): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    logger.warn({}, 'CRON_SECRET not set — cron endpoint is unprotected')
    return null
  }
  const header =
    req.headers.get('x-cron-secret') ??
    req.headers.get('authorization')?.replace('Bearer ', '')
  if (header !== cronSecret) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  return null
}

export function applyAiRateLimit(req: NextRequest) {
  return rateLimit(req, 'reports')
}

export async function createAiRun(input: {
  type: AiRunType
  contactId?: string | null
  inquiryId?: string | null
  input: Record<string, unknown>
  model?: string
}) {
  return prisma.aiRun.create({
    data: {
      type: input.type,
      status: AiRunStatus.running,
      contactId: input.contactId ?? undefined,
      inquiryId: input.inquiryId ?? undefined,
      input: input.input as Prisma.InputJsonValue,
      model: input.model,
    },
  })
}

export async function completeAiRun(input: {
  aiRunId: string
  output: Record<string, unknown>
  model?: string
  tokensInput?: number
  tokensOutput?: number
  latencyMs?: number
}) {
  return prisma.aiRun.update({
    where: { id: input.aiRunId },
    data: {
      status: AiRunStatus.succeeded,
      output: input.output as Prisma.InputJsonValue,
      model: input.model,
      tokensInput: input.tokensInput,
      tokensOutput: input.tokensOutput,
      latencyMs: input.latencyMs,
    },
  })
}

export async function failAiRun(input: { aiRunId?: string; error: unknown }) {
  const message = input.error instanceof Error ? input.error.message : String(input.error)
  if (input.aiRunId) {
    try {
      await prisma.aiRun.update({
        where: { id: input.aiRunId },
        data: { status: AiRunStatus.failed, error: message },
      })
    } catch (error) {
      logger.error({ error, aiRunId: input.aiRunId }, 'Failed updating ai run')
    }
  }
  return NextResponse.json({ ok: false, error: message }, { status: 500 })
}

export async function createSystemAiEvent(input: {
  type: string
  contactId?: string | null
  inquiryId?: string | null
  payload: Record<string, unknown>
}) {
  try {
    await prisma.systemEvent.create({
      data: {
        type: input.type,
        contactId: input.contactId ?? undefined,
        inquiryId: input.inquiryId ?? undefined,
        payload: input.payload as Prisma.InputJsonValue,
      },
    })
  } catch (error) {
    logger.error({ error, input }, 'Failed creating system event')
  }
}

export function toIso(value?: Date | string | null): string | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}
