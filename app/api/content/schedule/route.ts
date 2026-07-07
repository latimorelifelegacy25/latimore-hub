import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/ai/shared'

const scheduleContentSchema = z.object({
  assetId: z.string().min(1),
  scheduledFor: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  try {
    const body = await req.json().catch(() => null)
    const parsed = scheduleContentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'assetId and scheduledFor are required', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const scheduledFor = new Date(parsed.data.scheduledFor)
    if (Number.isNaN(scheduledFor.getTime())) {
      return NextResponse.json({ ok: false, error: 'scheduledFor must be a valid date' }, { status: 422 })
    }

    const asset = await prisma.contentAsset.update({
      where: { id: parsed.data.assetId },
      data: { status: 'scheduled', scheduledFor },
    })

    await prisma.systemEvent.create({
      data: {
        type: 'content.scheduled',
        payload: { assetId: asset.id, scheduledFor: scheduledFor.toISOString() },
      },
    })

    return NextResponse.json({ ok: true, asset })
  } catch (error) {
    console.error('Content scheduling failed:', error)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
