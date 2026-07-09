export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { requireAdminSession } from '@/lib/ai/shared'

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 'reports')
  if (limited) return limited

  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  try {
    const items = await prisma.$queryRaw<Array<{ page: string | null; count: bigint | number }>>`
      SELECT "pageUrl" AS page, COUNT(*) AS count
      FROM "Event"
      WHERE "pageUrl" IS NOT NULL
      GROUP BY 1
      ORDER BY COUNT(*) DESC
      LIMIT 50
    `

    return NextResponse.json({
      items: items.map((row) => ({ page: row.page, count: Number(row.count) })),
    })
  } catch (error) {
    console.error('Pages report API error:', error)
    return NextResponse.json({ ok: false, error: 'Failed to load pages report' }, { status: 500 })
  }
}
