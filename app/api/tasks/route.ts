export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const TasksQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  status: z.string().min(1).max(40).optional(),
})

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 'default')
  if (limited) return limited

  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  try {
    const query = TasksQuerySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams))
    if (!query.success) {
      return NextResponse.json(
        { ok: false, error: 'Invalid query parameters', details: query.error.flatten() },
        { status: 422 }
      )
    }

    const items = await prisma.task.findMany({
      where: query.data.status ? { status: query.data.status } : undefined,
      orderBy: { dueAt: 'asc' },
      take: query.data.limit,
      include: {
        contact: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        inquiry: { select: { id: true, stage: true, productInterest: true, status: true } },
      },
    })

    return NextResponse.json({ ok: true, items, limit: query.data.limit })
  } catch (error) {
    console.error('Task listing failed:', error)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
