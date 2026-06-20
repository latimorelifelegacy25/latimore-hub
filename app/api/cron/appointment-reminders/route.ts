import { NextRequest, NextResponse } from 'next/server'
import { requireCronAuth } from '@/lib/ai/shared'

export async function GET(req: NextRequest) {
  const unauthorized = requireCronAuth(req)
  if (unauthorized) return unauthorized

  return NextResponse.json(
    {
      ok: false,
      error: 'Appointment reminder automation is disabled until provider configuration and compliance review are complete.',
    },
    { status: 503 }
  )
}

export async function POST(req: NextRequest) {
  return GET(req)
}
