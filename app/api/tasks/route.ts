export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { requireAdminSession } from '@/lib/ai/shared'
import { z } from 'zod'

const TasksQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  status: z.string().min(1).max(40).optional(),
})

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 'default')
  if (limited) return limited

  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

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
