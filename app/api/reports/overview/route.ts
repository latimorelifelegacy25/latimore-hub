export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 'reports')
  if (limited) return limited

  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const now = new Date()
  const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const d28 = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000)

  const [leads7, leads28, booked7, won28, stageCounts] = await Promise.all([
    prisma.inquiry.count({ where: { createdAt: { gte: d7 } } }),
    prisma.inquiry.count({ where: { createdAt: { gte: d28 } } }),
    prisma.inquiry.count({ where: { status: 'Booked', updatedAt: { gte: d7 } } }),
    prisma.inquiry.count({ where: { status: 'Closed_Won', updatedAt: { gte: d28 } } }),
    prisma.inquiry.groupBy({ by: ['status'], _count: { _all: true } }),
  ])

  return NextResponse.json({
    kpis: { leads7, leads28, booked7, won28 },
    pipeline: stageCounts.map(x => ({ status: x.status, count: x._count._all })),
  })
}
