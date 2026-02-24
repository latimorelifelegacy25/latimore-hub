import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'cardEvents')
  if (limited) return limited

  try {
    const body = await req.json().catch(() => null)
    const { event, label, referrer, userAgent, timestamp } = (body ?? {}) as any

    if (!event || typeof event !== 'string') {
      return NextResponse.json({ error: 'Missing event' }, { status: 400 })
    }

    await prisma.cardEvent.create({
      data: {
        event: event.slice(0, 40),
        label: typeof label === 'string' ? label.slice(0, 200) : null,
        referrer: typeof referrer === 'string' ? referrer.slice(0, 500) : null,
        userAgent: typeof userAgent === 'string' ? userAgent.slice(0, 300) : null,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[card-events POST]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 'reports')
  if (limited) return limited

  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  try {
    const [totalVisits, clicks, recent, visitsByDay] = await Promise.all([
      prisma.cardEvent.count({ where: { event: 'visit' } }),

      prisma.cardEvent.groupBy({
        by: ['label'],
        where: { event: 'click', label: { not: null } },
        _count: { label: true },
        orderBy: { _count: { label: 'desc' } },
      }),

      prisma.cardEvent.findMany({
        orderBy: { timestamp: 'desc' },
        take: 100,
        select: {
          id: true,
          event: true,
          label: true,
          referrer: true,
          timestamp: true,
        },
      }),

      prisma.$queryRaw<{ day: string; count: number }[]>`
        SELECT
          DATE_TRUNC('day', timestamp)::date::text AS day,
          COUNT(*)::int AS count
        FROM "CardEvent"
        WHERE event = 'visit'
          AND timestamp >= NOW() - INTERVAL '30 days'
        GROUP BY 1
        ORDER BY 1 ASC
      `,
    ])

    const totalClicks = clicks.reduce((sum, c) => sum + c._count.label, 0)

    return NextResponse.json({
      totalVisits,
      totalClicks,
      clicks,
      recent,
      visitsByDay,
    })
  } catch (err) {
    console.error('[card-events GET]', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
