export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

const RULES = [
  { stage:'New',               staleDays:1, taskTitle:'First contact attempt',           priority:'high'   },
  { stage:'Attempted_Contact', staleDays:2, taskTitle:'2nd contact attempt',             priority:'high'   },
  { stage:'Qualified',         staleDays:5, taskTitle:'Move to booking - schedule call', priority:'high'   },
  { stage:'Follow_Up',         staleDays:7, taskTitle:'Re-engage - check in',            priority:'normal' },
  { stage:'Booked',            staleDays:3, taskTitle:'Post-appointment follow-up',      priority:'high'   },
]

const staleDate = (d:number) => new Date(Date.now() - d*86400000)
const dueSoon   = (d:number) => new Date(Date.now() + d*86400000)

export async function GET() {
  let created=0, skipped=0
  try {
    for (const rule of RULES) {
      const inquiries = await prisma.inquiry.findMany({
        where:{ stage:rule.stage as any, updatedAt:{ lt:staleDate(rule.staleDays) } },
        include:{ contact:true, tasks:{ where:{ status:{in:['Open','In_Progress','Snoozed']}, title:{ contains:rule.taskTitle.slice(0,20) } } } },
        take:50,
      })
      for (const inq of inquiries) {
        if (inq.tasks.length > 0) { skipped++; continue }
        const name = inq.contact?.fullName || [inq.contact?.firstName,inq.contact?.lastName].filter(Boolean).join(' ') || inq.contact?.email || 'Lead'
        await prisma.task.create({ data:{
          title: rule.taskTitle,
          description: `Auto-created. Contact: ${name}\nStage: ${rule.stage}\nLast activity: ${inq.updatedAt.toLocaleDateString('en-US')}`,
          status: 'Open',
          dueAt: dueSoon(rule.priority==='high' ? 1 : 2),
          inquiryId: inq.id,
          contactId: inq.contactId ?? undefined,
        }})
        await prisma.systemEvent.create({ data:{
          type:'automation.followup_task.created',
          contactId: inq.contactId ?? undefined,
          inquiryId: inq.id,
          payload:{ taskTitle:rule.taskTitle, stage:rule.stage, name } as any,
        }})
        created++
      }
    }
    logger.info({ created, skipped },'Lead follow-up cron done')
    return NextResponse.json({ ok:true, tasksCreated:created, skipped })
  } catch(err:any) {
    logger.error({ err:err.message },'Lead follow-up cron failed')
    return NextResponse.json({ ok:false, error:err.message },{status:500})
  }
}
