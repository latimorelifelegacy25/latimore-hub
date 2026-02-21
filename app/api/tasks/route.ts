export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const items = await prisma.task.findMany({
    orderBy: { dueAt: 'asc' },
    include: { contact: true, inquiry: true },
  })
  return NextResponse.json({ items })
}
