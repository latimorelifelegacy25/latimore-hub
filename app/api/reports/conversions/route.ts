export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { requireAdminSession } from '@/lib/ai/shared'

export async function GET(req: NextRequest) {
  const limited = rateLimit(req, 'reports')
  if (limited) return limited

  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  try {
    const [leadCount, bookedCount, soldCount, clickCount] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { stage: 'Booked' } }),
      prisma.inquiry.count({ where: { stage: 'Sold' } }),
      prisma.event.count({ where: { eventType: { in: ['cta_click', 'call_click', 'text_click', 'email_click', 'book_click'] as any } } }),
    ])

    return NextResponse.json({
      totals: {
        leads: leadCount,
        clicks: clickCount,
        booked: bookedCount,
        sold: soldCount,
      },
      rates: {
        clicksToLeads: clickCount > 0 ? Number((leadCount / clickCount).toFixed(3)) : 0,
        leadsToBooked: leadCount > 0 ? Number((bookedCount / leadCount).toFixed(3)) : 0,
        leadsToSold: leadCount > 0 ? Number((soldCount / leadCount).toFixed(3)) : 0,
      },
    })
  } catch (error) {
    console.error('Conversions report API error:', error)
    return NextResponse.json({ ok: false, error: 'Failed to load conversions report' }, { status: 500 })
  }
}
