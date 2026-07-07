import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/ai/shared'

const MAX_SOCIAL_CONNECTIONS = 100

const socialConnectionQuerySchema = z.object({
  provider: z.string().min(1).max(100).optional(),
  status: z.string().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(MAX_SOCIAL_CONNECTIONS).optional().default(50),
})

const socialConnectionBodySchema = z.object({
  provider: z.string().min(1).max(100),
  accountName: z.string().max(255).optional().nullable(),
  externalId: z.string().max(255).optional().nullable(),
  accessToken: z.string().max(5000).optional().nullable(),
  refreshToken: z.string().max(5000).optional().nullable(),
  tokenExpiresAt: z.string().datetime().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
  status: z.string().max(100).optional().nullable(),
})

function getSocialConnectionModel() {
  return (prisma as any).socialConnection
}

function unavailableResponse() {
  return NextResponse.json(
    { success: false, error: 'SocialConnection model unavailable. Run prisma generate after schema changes.' },
    { status: 501 },
  )
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminSession(req)
    if (!auth.ok) return auth.response

    const socialConnectionModel = getSocialConnectionModel()
    if (!socialConnectionModel) return unavailableResponse()

    const { searchParams } = new URL(req.url)
    const parsed = socialConnectionQuerySchema.safeParse({
      provider: searchParams.get('provider') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    })

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 422 })
    }

    const { provider, status, limit } = parsed.data
    const where: Record<string, unknown> = {}
    if (provider) where.provider = provider
    if (status) where.status = status

    const connections = await socialConnectionModel.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ success: true, connections, total: connections.length, limit })
  } catch (error) {
    console.error('Social connections fetch error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch social connections' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminSession(req)
    if (!auth.ok) return auth.response

    const body = await req.json().catch(() => null)
    const parsed = socialConnectionBodySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 422 })
    }

    const {
      provider,
      accountName,
      externalId,
      accessToken,
      refreshToken,
      tokenExpiresAt,
      metadata,
      status,
    } = parsed.data

    const socialConnectionModel = getSocialConnectionModel()
    if (!socialConnectionModel) return unavailableResponse()

    const data: Record<string, unknown> = {
      provider,
      accountName: accountName || undefined,
      externalId: externalId || undefined,
      accessToken: accessToken || undefined,
      refreshToken: refreshToken || undefined,
      metadata: metadata ?? undefined,
      status: status || undefined,
    }

    if (tokenExpiresAt) {
      data.tokenExpiresAt = new Date(tokenExpiresAt)
    }

    const existing = await socialConnectionModel.findFirst({
      where: {
        provider,
        externalId: externalId || undefined,
      },
    })

    const connection = existing
      ? await socialConnectionModel.update({
          where: { id: existing.id },
          data,
        })
      : await socialConnectionModel.create({ data })

    return NextResponse.json({ success: true, connection })
  } catch (error) {
    console.error('Social connection save error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save social connection' },
      { status: 500 },
    )
  }
}
