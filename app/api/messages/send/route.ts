export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { asyncRateLimit } from '@/lib/rate-limit'
import { requireAdminSession } from '@/lib/ai/shared'

const MessageRequestSchema = z.object({
  contactId: z.string().uuid(),
  inquiryId: z.string().uuid().optional().nullable(),
  channel: z.enum(['email', 'sms']),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(1).max(4000),
})

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  const limited = await asyncRateLimit(req, 'messages')
  if (limited) return limited

  const body = await req.json().catch(() => null)
  const parsed = MessageRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 422 })
  }

  return NextResponse.json(
    {
      ok: false,
      error: 'Outbound messaging is disabled until provider configuration and compliance review are complete.',
    },
    { status: 503 }
  )
}
