export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { createOpenAIJsonCompletion } from '@/lib/ai/client'

const GenerateTasksSchema = z.object({
  contactId: z.string().min(1).optional(),
  inquiryId: z.string().min(1).optional(),
}).refine((data) => Boolean(data.contactId || data.inquiryId), {
  message: 'contactId or inquiryId required',
  path: ['contactId'],
})

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'default')
  if (limited) return limited

  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  try {
    const body = await req.json().catch(() => null)
    const parsed = GenerateTasksSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Invalid task-generation payload', details: parsed.error.flatten() }, { status: 422 })
    }

    const { contactId, inquiryId } = parsed.data

    // Get contact/inquiry data for AI analysis with bounded related data
    let contact, inquiry

    if (contactId) {
      contact = await prisma.contact.findUnique({
        where: { id: contactId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          county: true,
          status: true,
          leadScore: true,
          lastActivityAt: true,
          nextFollowUpAt: true,
          notesSummary: true,
          inquiries: {
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: {
              id: true,
              stage: true,
              productInterest: true,
              status: true,
              leadScore: true,
              notes: true,
              appointments: {
                orderBy: { scheduledFor: 'desc' },
                take: 3,
                select: { scheduledFor: true, status: true },
              },
            },
          },
          notes: {
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { body: true, createdAt: true },
          },
          tasks: {
            where: { status: 'Open' },
            orderBy: { dueAt: 'asc' },
            take: 10,
            select: { title: true, description: true, dueAt: true, status: true },
          },
          appointments: {
            orderBy: { scheduledFor: 'desc' },
            take: 3,
            select: { scheduledFor: true, status: true },
          },
        },
      })
    }

    if (inquiryId) {
      inquiry = await prisma.inquiry.findUnique({
        where: { id: inquiryId },
        select: {
          id: true,
          stage: true,
          productInterest: true,
          status: true,
          leadScore: true,
          notes: true,
          appointments: {
            orderBy: { scheduledFor: 'desc' },
            take: 3,
            select: { scheduledFor: true, status: true },
          },
          tasks: {
            where: { status: 'Open' },
            orderBy: { dueAt: 'asc' },
            take: 10,
            select: { title: true, description: true, dueAt: true, status: true },
          },
          contact: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              county: true,
              status: true,
              leadScore: true,
              lastActivityAt: true,
              nextFollowUpAt: true,
              notesSummary: true,
              notes: {
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: { body: true, createdAt: true },
              },
              tasks: {
                where: { status: 'Open' },
                orderBy: { dueAt: 'asc' },
                take: 10,
                select: { title: true, description: true, dueAt: true, status: true },
              },
              appointments: {
                orderBy: { scheduledFor: 'desc' },
                take: 3,
                select: { scheduledFor: true, status: true },
              },
            },
          },
        },
      })
      contact = inquiry?.contact
    }

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    // Prepare data for AI analysis
    const analysisData = {
      contact: {
        name: `${contact.firstName} ${contact.lastName}`,
        email: contact.email,
        phone: contact.phone,
        county: contact.county,
        status: contact.status,
        leadScore: contact.leadScore,
        lastActivity: contact.lastActivityAt,
        nextFollowUp: contact.nextFollowUpAt,
        notesSummary: contact.notesSummary
      },
      inquiry: inquiry ? {
        stage: inquiry.stage,
        productInterest: inquiry.productInterest,
        status: inquiry.status,
        leadScore: inquiry.leadScore,
        notes: inquiry.notes
      } : null,
      recentNotes: contact.notes.map(note => ({
        content: note.body,
        createdAt: note.createdAt
      })),
      existingTasks: contact.tasks.map(task => ({
        title: task.title,
        description: task.description,
        dueAt: task.dueAt,
        status: task.status
      })),
      appointments: contact.appointments.map(apt => ({
        scheduledFor: apt.scheduledFor,
        status: apt.status
      }))
    }

    // Generate AI task recommendations
    const tasksResult = await createOpenAIJsonCompletion<{
      tasks: Array<{
        title: string
        description: string
        priority: 'high' | 'medium' | 'low'
        dueInDays: number
        category: 'follow_up' | 'qualification' | 'nurture' | 'appointment' | 'research'
      }>
    }>({
      system: `You are an expert CRM task strategist. Analyze contact data and generate actionable, prioritized tasks to move the contact forward in the sales pipeline.

Consider:
- Contact status and lead score
- Time since last activity
- Existing tasks and appointments
- Product interest and stage
- County and local context
- Notes and communication history

Generate 1-3 high-priority tasks that will advance the contact. Each task should be specific, actionable, and time-bound.`,
      user: `Generate follow-up tasks for this contact based on their current status and activity:

${JSON.stringify(analysisData, null, 2)}

Provide tasks in this JSON format:
{
  "tasks": [
    {
      "title": "Brief, actionable task title",
      "description": "Detailed description of what to do and why",
      "priority": "high|medium|low",
      "dueInDays": number (days from now),
      "category": "follow_up|qualification|nurture|appointment|research"
    }
  ]
}`,
      schemaName: 'taskRecommendations',
      schema: {
        type: 'object',
        properties: {
          tasks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                priority: { type: 'string', enum: ['high', 'medium', 'low'] },
                dueInDays: { type: 'number', minimum: 1, maximum: 30 },
                category: { type: 'string', enum: ['follow_up', 'qualification', 'nurture', 'appointment', 'research'] }
              },
              required: ['title', 'description', 'priority', 'dueInDays', 'category']
            }
          }
        },
        required: ['tasks']
      },
      temperature: 0.7
    })

    if (!tasksResult?.output?.tasks || tasksResult.output.tasks.length === 0) {
      return NextResponse.json({ error: 'No tasks generated' }, { status: 400 })
    }

    // Create tasks in database
    const createdTasks = []
    for (const taskData of tasksResult.output.tasks) {
      const dueAt = new Date()
      dueAt.setDate(dueAt.getDate() + taskData.dueInDays)

      const task = await prisma.task.create({
        data: {
          title: taskData.title,
          description: taskData.description,
          dueAt,
          contactId: contact.id,
          inquiryId: inquiry?.id,
          status: 'Open'
        }
      })
      createdTasks.push(task)
    }

    return NextResponse.json({
      success: true,
      tasks: createdTasks,
      message: `Generated ${createdTasks.length} AI-powered tasks`
    })

  } catch (error) {
    console.error('AI task generation error:', error)
    return NextResponse.json({ error: 'Failed to generate tasks' }, { status: 500 })
  }
}
