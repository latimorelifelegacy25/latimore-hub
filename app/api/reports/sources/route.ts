export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { getSourceReport } from '@/lib/hub/reporting'
import { countAll } from '@/lib/prisma-helpers'
import { requireAdminSession } from '@/lib/ai/shared'

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 'reports')
  if (limited) return limited

  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  try {
    const items = await getSourceReport()
    return NextResponse.json({
      items: items.map((row) => ({
        source: row.source,
        medium: row.medium,
        campaign: row.campaign,
        count: countAll(row._count),
      })),
    })
  } catch (error) {
    console.error('Source report API error:', error)
    return NextResponse.json({ ok: false, error: 'failed_to_load_source_report' }, { status: 500 })
  }
}
