import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { InquiryPatchSchema } from '@/lib/schemas'
import { logger } from '@/lib/logger'
import { changeInquiryStage } from '@/lib/hub/change-stage'
import { requireAdminSession } from '@/lib/ai/shared'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimit(req, 'inquiries')
  if (limited) return limited

  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  const { id } = await params

  const body = await req.json().catch(() => null)
  const parse = InquiryPatchSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json(
      { ok: false, error: parse.error.flatten() },
      { status: 422 }
    )
  }

  try {
    const item = await changeInquiryStage({
      inquiryId: id,
      stage: parse.data.stage,
      notes: parse.data.notes,
      actor: parse.data.actor ?? auth.session?.user?.email ?? 'admin',
    })

    logger.info({ inquiryId: id, stage: parse.data.stage }, 'Inquiry stage updated')
    return NextResponse.json({ ok: true, item })
  } catch (err: any) {
    logger.error({ err: err.message }, 'Inquiry PATCH error')
    const status = /not found/i.test(err.message) ? 404 : 500
    return NextResponse.json(
      { ok: false, error: status === 404 ? 'not found' : 'server error' },
      { status }
    )
  }
}
