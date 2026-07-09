export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { normalizeStage } from '@/lib/hub/normalizers'
import { requireAdminSession } from '@/lib/ai/shared'

const InquiryQuerySchema = z.object({
  stage: z.string().trim().max(80).optional(),
  status: z.string().trim().max(80).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
})

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 'inquiries')
  if (limited) return limited

  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  try {
    const { searchParams } = new URL(req.url)
    const parsed = InquiryQuerySchema.safeParse(Object.fromEntries(searchParams.entries()))
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'invalid query' }, { status: 422 })
    }

    const stage = normalizeStage(parsed.data.stage ?? parsed.data.status ?? 'New')
    const take = parsed.data.limit ?? 50

    const items = await prisma.inquiry.findMany({
      where: { stage },
      orderBy: { createdAt: 'desc' },
      take,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        stage: true,
        productInterest: true,
        source: true,
        leadScore: true,
        contactId: true,
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    return NextResponse.json({ items })
  } catch {
    return NextResponse.json({ ok: false, error: 'failed to load inquiries' }, { status: 500 })
  }
}
