export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/ai/shared'

const Schema = z.object({
  assetId: z.string().min(1),
  action: z.enum(['approve','schedule','archive']),
  scheduledFor: z.string().optional().nullable(),
})

export async function POST(req:NextRequest) {
  const auth = await requireAdminSession()
  if (!auth.ok) return auth.response
  const body = await req.json().catch(()=>null)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok:false, error:parsed.error.flatten() },{status:422})
  const { assetId, action, scheduledFor } = parsed.data
  let data: Record<string,unknown> = {}
  if (action==='approve') data = { status:'approved' }
  else if (action==='schedule') {
    if (!scheduledFor) return NextResponse.json({ ok:false, error:'scheduledFor required' },{status:422})
    data = { status:'scheduled', scheduledFor:new Date(scheduledFor) }
  } else if (action==='archive') data = { status:'archived' }
  try {
    const asset = await prisma.contentAsset.update({ where:{ id:assetId }, data })
    await prisma.systemEvent.create({ data:{ type:`content.${action}d`, payload:{ assetId, action, status:asset.status } as any } })
    return NextResponse.json({ ok:true, asset })
  } catch(err:any) {
    return NextResponse.json({ ok:false, error:err.message },{status:500})
  }
}
