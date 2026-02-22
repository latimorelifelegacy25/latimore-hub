import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, label, referrer, userAgent, timestamp } = body

    if (!event) {
      return NextResponse.json({ error: 'Missing event' }, { status: 400 })
    }

    await prisma.cardEvent.create({
      data: {
        event,
        label: label ?? null,
        referrer: referrer ?? null,
        userAgent: userAgent ?? null,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[card-events POST]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function GET() {
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

      // Visits grouped by day for last 30 days
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
