export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

const BRAND_SYSTEM = `You are the Legacy AI content strategist for Latimore Life & Legacy LLC serving Schuylkill, Luzerne, and Northumberland Counties PA. Tone: calm, authoritative, community-focused. Tagline: Protecting Today. Securing Tomorrow. #TheBeatGoesOn. Founder: Jackson M. Latimore Sr., MBA - cardiac arrest survivor, AED saved his life at ESU 2010. Compliance: use may/can/typically, no guarantees. Footer: Jackson M. Latimore Sr. | Independent Insurance Consultant | PA License #1268820 | NIPR #21638507. Educational content only. Respond ONLY with valid JSON, no markdown.`

const AUDIENCES = [
  'Young families focused on mortgage and income protection',
  'Pre-retirees approaching retirement with IRA and annuity questions',
  'Business owners needing key person and buy-sell coverage',
  'School district and municipal employees seeking supplemental benefits',
]

function getAudience() {
  const week = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,1).getTime()) / 604800000)
  return AUDIENCES[week % AUDIENCES.length]
}

function getWeekDates() {
  const now = new Date()
  const mon = new Date(now)
  mon.setDate(now.getDate() - now.getDay() + 1)
  mon.setHours(9,0,0,0)
  const days: Record<string,Date> = {}
  ;['Monday','Tuesday','Wednesday','Thursday','Friday'].forEach((n,i) => {
    const d = new Date(mon); d.setDate(mon.getDate()+i); days[n]=d
  })
  return days
}

export async function GET() {
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ ok:false, skipped:true, reason:'OPENAI_API_KEY not set' })
  const audience = getAudience()
  const weekDates = getWeekDates()
  const weekStart = weekDates['Monday'].toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},
      body:JSON.stringify({
        model:'gpt-4o-mini', temperature:0.6,
        response_format:{type:'json_object'},
        messages:[
          {role:'system',content:BRAND_SYSTEM},
          {role:'user',content:`Generate 5 social posts Mon-Fri for week of ${weekStart}. Audience: ${audience}. Mon=Education, Tue=FAQ, Wed=Founder/authority, Thu=Objection-breaker, Fri=Soft CTA. 150-220 words each, 5-8 hashtags. Return JSON: {"posts":[{"day":string,"pillar":string,"audience":string,"title":string,"body":string,"hashtags":string}]}`}
        ]
      })
    })
    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content ?? '{}'
    let parsed: any
    try { parsed = JSON.parse(raw) } catch { parsed = {} }
    const posts: any[] = parsed.posts ?? []
    if (!posts.length) return NextResponse.json({ ok:false, error:'No posts from AI' },{status:500})
    const created: string[] = []
    for (const post of posts) {
      const asset = await prisma.contentAsset.create({data:{
        title: post.title ?? `${post.day} Post`,
        type: 'social_post', status: 'draft',
        channel: 'facebook,linkedin',
        audience: post.audience ?? audience,
        campaign: `weekly_${weekStart.replace(/\s/g,'_').toLowerCase()}`,
        prompt: `Auto weekly batch. Pillar: ${post.pillar}`,
        bodyText: `${post.body}\n\n${post.hashtags ?? ''}`,
        metadata: { source:'weekly_content_cron', pillar:post.pillar, day:post.day, weekStart, model:'gpt-4o-mini' },
        scheduledFor: weekDates[post.day] ?? weekDates['Monday'],
      }})
      created.push(asset.id)
    }
    await prisma.systemEvent.create({data:{type:'cron.weekly_content.completed',payload:{assetIds:created,weekStart,audience,count:created.length} as any}})
    logger.info({count:created.length},'Weekly content cron done')
    return NextResponse.json({ ok:true, created:created.length, weekStart, audience })
  } catch(err:any) {
    logger.error({err:err.message},'Weekly content cron failed')
    return NextResponse.json({ ok:false, error:err.message },{status:500})
  }
}
