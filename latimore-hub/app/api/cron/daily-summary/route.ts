export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * Vercel cron — runs daily at 11:00 AM ET (15:00 UTC).
 * Generates a lightweight pipeline summary and writes it as a SystemEvent
 * so it appears in the admin analytics feed. No OpenAI key required.
 */
export async function GET() {
  try {
    const now = new Date()

    const [stageCounts, newToday, bookedToday, totalContacts, overdueTasks] = await Promise.all([
      prisma.inquiry.groupBy({ by: ['stage'], _count: { _all: true } }),
      prisma.inquiry.count({ where: { createdAt: { gte: new Date(now.setHours(0, 0, 0, 0)) } } }),
      prisma.inquiry.count({ where: { stage: 'Booked', updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
      prisma.contact.count(),
      prisma.task.count({ where: { dueAt: { lt: new Date() }, status: { in: ['Open', 'In_Progress'] } } }),
    ])

    const summary = {
      generatedAt: new Date().toISOString(),
      totalContacts,
      newLeadsToday: newToday,
      bookedToday,
      overdueTasks,
      pipeline: stageCounts.map((r) => ({ stage: r.stage, count: r._count._all })),
    }

    await prisma.systemEvent.create({
      data: {
        type: 'cron.daily_summary.completed',
        payload: summary as any,
      },
    })

    logger.info({ summary }, 'Daily summary cron completed')
    return NextResponse.json({ ok: true, ...summary })
  } catch (err: any) {
    logger.error({ err: err.message }, 'Daily summary cron failed')
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
