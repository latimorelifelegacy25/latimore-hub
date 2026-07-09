export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/ai/shared'

const TimeSeriesQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
})

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 'reports')
  if (limited) return limited

  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  try {
    const url = new URL(req.url)
    const parsed = TimeSeriesQuerySchema.safeParse({
      days: url.searchParams.get('days') ?? undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid time-series query', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const { days } = parsed.data
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const dailyMetrics = await prisma.$queryRaw<Array<{
      date: string
      inquiries: number
      contacts: number
      bookings: number
      events: number
    }>>`
      SELECT
        DATE(d.date) as date,
        COALESCE(i.count, 0) as inquiries,
        COALESCE(c.count, 0) as contacts,
        COALESCE(b.count, 0) as bookings,
        COALESCE(e.count, 0) as events
      FROM (
        SELECT generate_series(
          ${startDate}::date,
          CURRENT_DATE,
          '1 day'::interval
        )::date as date
      ) d
      LEFT JOIN (
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM "Inquiry"
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
      ) i ON d.date = i.date
      LEFT JOIN (
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM "Contact"
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
      ) c ON d.date = c.date
      LEFT JOIN (
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM "Appointment"
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
      ) b ON d.date = b.date
      LEFT JOIN (
        SELECT DATE(occurred_at) as date, COUNT(*) as count
        FROM "Event"
        WHERE occurred_at >= ${startDate}
        GROUP BY DATE(occurred_at)
      ) e ON d.date = e.date
      ORDER BY d.date
    `

    const funnelData = await prisma.$queryRaw<Array<{
      stage: string
      count: number
      conversion_rate: number
    }>>`
      SELECT
        stage,
        COUNT(*) as count,
        CASE
          WHEN LAG(COUNT(*)) OVER (ORDER BY
            CASE stage
              WHEN 'New' THEN 1
              WHEN 'Attempted_Contact' THEN 2
              WHEN 'Contacted' THEN 3
              WHEN 'Qualified' THEN 4
              WHEN 'Booked' THEN 5
              WHEN 'In_Consult' THEN 6
              WHEN 'Closed_Won' THEN 7
              WHEN 'Closed_Lost' THEN 8
              ELSE 9
            END
          ) IS NULL THEN 100.0
          ELSE (COUNT(*)::float / LAG(COUNT(*)) OVER (ORDER BY
            CASE stage
              WHEN 'New' THEN 1
              WHEN 'Attempted_Contact' THEN 2
              WHEN 'Contacted' THEN 3
              WHEN 'Qualified' THEN 4
              WHEN 'Booked' THEN 5
              WHEN 'In_Consult' THEN 6
              WHEN 'Closed_Won' THEN 7
              WHEN 'Closed_Lost' THEN 8
              ELSE 9
            END
          )) * 100.0
        END as conversion_rate
      FROM "Inquiry"
      WHERE created_at >= ${startDate}
      GROUP BY stage
      ORDER BY
        CASE stage
          WHEN 'New' THEN 1
          WHEN 'Attempted_Contact' THEN 2
          WHEN 'Contacted' THEN 3
          WHEN 'Qualified' THEN 4
          WHEN 'Booked' THEN 5
          WHEN 'In_Consult' THEN 6
          WHEN 'Closed_Won' THEN 7
          WHEN 'Closed_Lost' THEN 8
          ELSE 9
        END
    `

    return NextResponse.json({
      dailyMetrics,
      funnelData,
    })
  } catch (error) {
    console.error('Time series API error:', error)
    return NextResponse.json({ ok: false, error: 'Failed to load time-series report' }, { status: 500 })
  }
}
