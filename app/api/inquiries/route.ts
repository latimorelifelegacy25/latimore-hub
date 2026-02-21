export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? 'New_Inquiry'

  const items = await prisma.inquiry.findMany({
    where: { status: status.replace(' ', '_') as any },
    orderBy: { createdAt: 'desc' },
    include: { contact: true },
  })
  return NextResponse.json({ items })
}
