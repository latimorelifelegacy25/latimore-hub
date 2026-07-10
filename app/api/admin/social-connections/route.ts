import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/ai/shared'
import { Prisma, SocialProvider } from '@prisma/client'

const MAX_SOCIAL_CONNECTIONS = 100

const socialConnectionQuerySchema = z.object({
  provider: z.nativeEnum(SocialProvider).optional(),
  status: z.string().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(MAX_SOCIAL_CONNECTIONS).optional().default(50),
})

const socialConnectionBodySchema = z.object({
  provider: z.nativeEnum(SocialProvider),
  accountName: z.string().max(255).optional().nullable(),
  externalId: z.string().max(255).optional().nullable(),
  accessToken: z.string().max(5000).optional().nullable(),
  refreshToken: z.string().max(5000).optional().nullable(),
  tokenExpiresAt: z.string().datetime().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
  status: z.string().max(100).optional().nullable(),
})

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminSession(req)
    if (!auth.ok) return auth.response

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
    const where: Prisma.SocialConnectionWhereInput = {}
    if (provider) where.provider = provider
    if (status) where.status = status

    const connections = await prisma.socialConnection.findMany({
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

    const data = {
      provider,
      accountName: accountName ?? undefined,
      externalId: externalId ?? undefined,
      accessToken: accessToken ?? undefined,
      refreshToken: refreshToken ?? undefined,
      tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : undefined,
      metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
      status: status ?? undefined,
    }

    const existing = await prisma.socialConnection.findFirst({
      where: {
        provider,
        externalId: externalId || undefined,
      },
    })

    const connection = existing
      ? await prisma.socialConnection.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.socialConnection.create({ data })

    return NextResponse.json({ success: true, connection })
  } catch (error) {
    console.error('Social connection save error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save social connection' },
      { status: 500 },
    )
  }
}
