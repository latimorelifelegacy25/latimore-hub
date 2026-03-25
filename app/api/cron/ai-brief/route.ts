export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

/**
 * Vercel cron — runs daily at 1:00 PM ET (17:00 UTC).
 * Triggers the AI daily brief generation by calling /api/ai/daily-brief
 * using a server-side internal fetch with a cron auth header.
 * Requires OPENAI_API_KEY to be set in Vercel env vars.
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://latimorelifelegacy.com'
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
    if (cronSecret) headers['x-cron-secret'] = cronSecret

    const res = await fetch(`${baseUrl}/api/ai/daily-brief`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ limit: 10 }),
    })

    const data = await res.json().catch(() => ({}))
    logger.info({ status: res.status }, 'AI brief cron triggered')
    return NextResponse.json({ ok: res.ok, status: res.status, ...data })
  } catch (err: any) {
    logger.error({ err: err.message }, 'AI brief cron failed')
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
