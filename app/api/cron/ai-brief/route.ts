export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireCronAuth } from '@/lib/ai/shared'
import { logger } from '@/lib/logger'

/**
 * GET /api/cron/ai-brief
 * Vercel cron — runs daily at 1:00 PM ET (17:00 UTC).
 *
 * FIXES:
 * 1. Was using NEXT_PUBLIC_BASE_URL (points to latimorelifelegacy.com marketing site).
 *    Now uses NEXTAUTH_URL which is the actual Hub OS Vercel deployment URL.
 * 2. Added requireCronAuth() to protect the endpoint.
 * 3. Passes x-cron-secret to the downstream AI route so it bypasses
 *    requireAdminSession (which has no session cookie in a server-side fetch).
 */
export async function GET(req: NextRequest) {
  const authError = requireCronAuth(req)
  if (authError) return authError

  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const cronSecret = process.env.CRON_SECRET

  if (!process.env.OPENAI_API_KEY) {
    logger.warn({}, 'AI brief cron skipped — OPENAI_API_KEY not set')
    return NextResponse.json({ ok: false, skipped: true, reason: 'OPENAI_API_KEY not configured' })
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-cron-source': 'vercel-cron',
    }
    if (cronSecret) {
      headers['x-cron-secret'] = cronSecret
    }

    const res = await fetch(`${baseUrl}/api/ai/daily-brief`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ limit: 10 }),
    })

    const data = await res.json().catch(() => ({}))
    logger.info({ status: res.status }, 'AI brief cron triggered')

    if (!res.ok) {
      logger.error({ status: res.status, data }, 'AI brief cron — downstream returned error')
    }

    return NextResponse.json({ ok: res.ok, status: res.status, ...data })
  } catch (err: any) {
    logger.error({ err: err.message }, 'AI brief cron failed')
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
