export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { getRecentEvents } from '@/lib/hub/reporting'
import { requireAdminSession } from '@/lib/ai/shared'

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 'reports')
  if (limited) return limited
  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  try {
    const items = await getRecentEvents(100)
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Recent events report API error:', error)
    return NextResponse.json({ ok: false, error: 'failed_to_load_recent_events' }, { status: 500 })
  }
}
