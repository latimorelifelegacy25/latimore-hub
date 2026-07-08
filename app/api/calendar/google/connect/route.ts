export const dynamic = 'force-dynamic'

import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { buildGoogleCalendarAuthUrl } from '@/lib/calendar/google'
import { requireAdminSession } from '@/lib/ai/shared'
import { logger } from '@/lib/logger'

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  try {
    const state = crypto.randomBytes(24).toString('hex')
    const url = buildGoogleCalendarAuthUrl(state)

    const res = NextResponse.redirect(url)
    res.cookies.set('google_calendar_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10,
    })

    return res
  } catch (error) {
    logger.error({ error }, 'Failed to build Google Calendar OAuth URL')
    return NextResponse.json(
      { ok: false, error: 'failed_to_start_google_calendar_oauth' },
      { status: 500 }
    )
  }
}
