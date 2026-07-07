import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { publishSocialPost } from '@/lib/social'
import { requireAdminSession } from '@/lib/ai/shared'

const CONTENT_PUBLISH_BATCH_SIZE = 50

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  try {
    const now = new Date()
    const assets = await prisma.contentAsset.findMany({
      where: { status: 'scheduled', scheduledFor: { lte: now } },
      orderBy: { scheduledFor: 'asc' },
      take: CONTENT_PUBLISH_BATCH_SIZE,
    })
    let publishedCount = 0

    for (const asset of assets) {
      try {
        await publishSocialPost(asset)
        await prisma.contentAsset.update({ where: { id: asset.id }, data: { status: 'published', publishedAt: new Date() } })
        await prisma.systemEvent.create({ data: { type: 'content.published', payload: { assetId: asset.id, channel: asset.channel } } })
        publishedCount += 1
      } catch (error) {
        await prisma.systemEvent.create({
          data: {
            type: 'content.publish_failed',
            payload: {
              assetId: asset.id,
              channel: asset.channel,
              error: error instanceof Error ? error.message : String(error),
            },
          },
        })
      }
    }

    return NextResponse.json({
      ok: true,
      published: publishedCount,
      total: assets.length,
      batchSize: CONTENT_PUBLISH_BATCH_SIZE,
    })
  } catch (error) {
    console.error('Content publish failed:', error)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
