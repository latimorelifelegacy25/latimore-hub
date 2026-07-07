/**
 * POST /api/admin/ai/generate-content
 * Generate AI-powered social media content using OpenAI.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createOpenAIJsonCompletion } from '@/lib/ai/client'
import { requireAdminSession } from '@/lib/ai/shared'

const generateContentSchema = z.object({
  topic: z.string().trim().min(1),
  platform: z.enum(['linkedin', 'facebook', 'instagram', 'twitter']).default('linkedin'),
  count: z.number().int().min(1).max(5).default(1),
})

const CONTENT_SCHEMA = {
  type: 'object' as const,
  properties: {
    title: {
      type: 'string',
      description: 'Post title or headline',
    },
    draft: {
      type: 'string',
      description: 'Full social media post content',
    },
    platform: {
      type: 'string',
      enum: ['linkedin', 'facebook', 'instagram', 'twitter'],
    },
    hashtags: {
      type: 'array',
      items: { type: 'string' },
      description: 'Suggested hashtags',
    },
  },
  required: ['title', 'draft', 'platform', 'hashtags'],
}

const BRAND_VOICE = `You are the content strategist for Latimore Life & Legacy LLC.
Brand Voice:
- Authentic, personal, community-focused (Central PA: Schuylkill, Luzerne, Northumberland Counties)
- Educational, urgent but NOT fear-based
- Emphasize protection, family legacy, preparation
- No morbid language
- Respectful of the Jackson M. Latimore Sr. cardiac arrest story (preparation becomes legacy)

Non-Negotiables:
- Include tagline: "Protecting Today. Securing Tomorrow."
- Include hashtag: "#TheBeatGoesOn"
- Plain language (8th grade level)
- Focus on legacy, not death
- Solutions-oriented
- Warm and community-focused`

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession(req)
  if (!auth.ok) return auth.response

  try {
    const body = await req.json().catch(() => null)
    const parsed = generateContentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'topic, platform, and count are invalid', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const { topic, platform, count } = parsed.data
    const userPrompt = `Generate ${count} social media post(s) for ${platform} about: "${topic}"`

    const results = []
    for (let i = 0; i < count; i++) {
      const result = await createOpenAIJsonCompletion({
        system: BRAND_VOICE,
        user: userPrompt,
        schemaName: 'SocialMediaContent',
        schema: CONTENT_SCHEMA,
        temperature: 0.8,
      })
      results.push(result.output)
    }

    return NextResponse.json({
      ok: true,
      count: results.length,
      posts: results.flat(),
    })
  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to generate content' },
      { status: 500 }
    )
  }
}
