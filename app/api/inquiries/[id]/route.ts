import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { InquiryPatchSchema } from '@/lib/schemas'
import { logger } from '@/lib/logger'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const limited = rateLimit(req, 'inquiries')
  if (limited) return limited

  const session = await getServerSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parse = InquiryPatchSchema.safeParse(body)
  if (!parse.success) return NextResponse.json({ ok: false, error: parse.error.flatten() }, { status: 422 })

  const { status, notes, actor } = parse.data

  try {
    const prev = await prisma.inquiry.findUnique({ where: { id: params.id }, select: { status: true } })
    if (!prev) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 })

    const item = await prisma.inquiry.update({ where: { id: params.id }, data: { status, notes } })
    await prisma.inquiryStageHistory.create({
      data: { inquiryId: params.id, fromStatus: prev.status as any, toStatus: status as any, actor: actor ?? session.user?.email ?? 'admin' },
    }).catch(() => {})

    logger.info({ inquiryId: params.id, from: prev.status, to: status }, 'Inquiry status updated')
    return NextResponse.json({ ok: true, item })
  } catch (err: any) {
    logger.error({ err: err.message }, 'Inquiry PATCH error')
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 })
  }
}
