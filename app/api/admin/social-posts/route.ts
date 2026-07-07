import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/ai/shared'

const MAX_SOCIAL_POSTS = 100

const socialPostQuerySchema = z.object({
  status: z.enum(['draft', 'scheduled', 'published']).optional(),
  channel: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(MAX_SOCIAL_POSTS).optional().default(50),
})

const socialPostBodySchema = z.object({
  title: z.string().max(255).optional().nullable(),
  bodyText: z.string().min(1).max(4000),
  channel: z.enum(['facebook', 'linkedin', 'instagram', 'twitter']),
  type: z.literal('social_post').optional().default('social_post'),
  scheduledFor: z.string().datetime().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
})

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminSession(req)
    if (!auth.ok) return auth.response

    const { searchParams } = new URL(req.url)
    const parsed = socialPostQuerySchema.safeParse({
      status: searchParams.get('status') ?? undefined,
      channel: searchParams.get('channel') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    })

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 422 })
    }

    const { status, channel, limit } = parsed.data
    const where: Record<string, unknown> = { type: 'social_post' }

    if (status) where.status = status
    if (channel) where.channel = channel

    const posts = await prisma.contentAsset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({
      success: true,
      posts,
      total: posts.length,
      limit,
    })
  } catch (error) {
    console.error('Social posts fetch error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminSession(req)
    if (!auth.ok) return auth.response

    const body = await req.json().catch(() => null)
    const parsed = socialPostBodySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 422 })
    }

    const { title, bodyText, channel, type, scheduledFor, metadata } = parsed.data

    const asset = await prisma.contentAsset.create({
      data: {
        title: title || 'Social Media Post',
        type,
        status: scheduledFor ? 'scheduled' : 'draft',
        channel,
        bodyText,
        bodyHtml: bodyText,
        metadata: metadata ?? undefined,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        createdBy: 'admin',
      },
    })

    await prisma.systemEvent.create({
      data: {
        type: 'content.scheduled',
        payload: {
          assetId: asset.id,
          channel,
          scheduledFor,
          type,
        },
      },
    })

    return NextResponse.json({
      success: true,
      asset,
      message: scheduledFor ? 'Post scheduled successfully' : 'Post saved as draft',
    })
  } catch (error) {
    console.error('Social post creation error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create post' },
      { status: 500 }
    )
  }
}
