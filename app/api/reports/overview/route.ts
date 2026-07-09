export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { getDashboardOverview } from '@/lib/hub/reporting'
import { requireAdminSession } from '@/lib/ai/shared'

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 'reports')
  if (limited) return limited

  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  try {
    const overview = await getDashboardOverview()

    return NextResponse.json({
      kpis: {
        leadsThisMonth: overview.kpis.leadsThisMonth,
        clicksThisMonth: overview.kpis.clicksThisMonth,
        bookingsThisMonth: overview.kpis.bookingsThisMonth,
        staleLeads: overview.kpis.staleLeads,
      },
      highlights: overview.highlights,
      pipeline: overview.pipeline.map((row) => ({ status: row.stage, count: row.count })),
    })
  } catch (error) {
    console.error('Reports overview failed:', error)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
