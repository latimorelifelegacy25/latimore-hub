export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/ai/shared'

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 'reports')
  if (limited) return limited

  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  try {
    const [sourceCounts, countyCounts, recentEvents, productCounts] = await Promise.all([
      prisma.inquiry.groupBy({
        by: ['source'],
        _count: { _all: true },
        where: { source: { not: null } },
        orderBy: {
          _count: {
            source: 'desc',
          },
        },
        take: 10,
      }),
      prisma.contact.groupBy({
        by: ['county'],
        _count: { _all: true },
        where: { county: { not: null } },
        orderBy: {
          _count: {
            county: 'desc',
          },
        },
        take: 10,
      }),
      prisma.systemEvent.findMany({
        take: 25,
        orderBy: { occurredAt: 'desc' },
      }),
      prisma.inquiry.groupBy({
        by: ['productInterest'],
        _count: { _all: true },
        orderBy: {
          _count: {
            productInterest: 'desc',
          },
        },
        take: 10,
      }),
    ])

    return NextResponse.json({
      sourceCounts,
      countyCounts,
      recentEvents,
      productCounts,
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ ok: false, error: 'failed_to_load_overview_analytics' }, { status: 500 })
  }
}
