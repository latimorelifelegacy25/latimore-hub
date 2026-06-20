import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const memoryStore = new Map<string, { count: number; reset: number }>()

const LIMITS: Record<string, { limit: number; windowMs: number }> = {
  cardEvents: { limit: 200, windowMs: 60_000 },
  fillout:   { limit: 20,  windowMs: 60_000 },
  inquiries: { limit: 60,  windowMs: 60_000 },
  booking:   { limit: 10,  windowMs: 60_000 },
  messages:  { limit: 20,  windowMs: 60_000 },
  reports:   { limit: 30,  windowMs: 60_000 },
  ai:        { limit: 20,  windowMs: 60_000 },
  default:   { limit: 100, windowMs: 60_000 },
}

let redis: Redis | null | undefined
const limiters = new Map<string, Ratelimit>()

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    'unknown'
  )
}

function getRedis(): Redis | null {
  if (redis !== undefined) return redis

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  redis = url && token ? new Redis({ url, token }) : null
  return redis
}

function getLimiter(type: string): Ratelimit | null {
  const client = getRedis()
  if (!client) return null

  const { limit, windowMs } = LIMITS[type] ?? LIMITS.default
  const key = `${type}:${limit}:${windowMs}`
  const cached = limiters.get(key)
  if (cached) return cached

  const limiter = new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(limit, `${Math.ceil(windowMs / 1000)} s`),
    prefix: `latimore-hub:${type}`,
  })

  limiters.set(key, limiter)
  return limiter
}

function tooManyRequests(limit: number, retryAfterSeconds = 60, remaining?: number): NextResponse {
  const headers: Record<string, string> = {
    'Retry-After': String(Math.max(1, retryAfterSeconds)),
    'X-RateLimit-Limit': String(limit),
  }

  if (typeof remaining === 'number') {
    headers['X-RateLimit-Remaining'] = String(Math.max(0, remaining))
  }

  return NextResponse.json(
    { ok: false, error: 'Too many requests — please slow down.' },
    { status: 429, headers }
  )
}

function memoryRateLimit(req: NextRequest, type = 'default'): NextResponse | null {
  const { limit, windowMs } = LIMITS[type] ?? LIMITS.default
  const key = `${type}:${getClientIp(req)}`
  const now = Date.now()
  const rec = memoryStore.get(key)

  if (!rec || now > rec.reset) {
    memoryStore.set(key, { count: 1, reset: now + windowMs })
    return null
  }

  if (rec.count >= limit) {
    const retryAfterSeconds = Math.ceil((rec.reset - now) / 1000)
    return tooManyRequests(limit, retryAfterSeconds, 0)
  }

  rec.count++
  return null
}

/**
 * Legacy synchronous limiter kept for older route handlers.
 * Production-sensitive public endpoints should use asyncRateLimit().
 */
export function rateLimit(req: NextRequest, type = 'default'): NextResponse | null {
  return memoryRateLimit(req, type)
}

/**
 * Production limiter backed by Upstash Redis. Fails closed in production if
 * UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are missing.
 */
export async function asyncRateLimit(req: NextRequest, type = 'default'): Promise<NextResponse | null> {
  const { limit } = LIMITS[type] ?? LIMITS.default
  const limiter = getLimiter(type)

  if (!limiter) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { ok: false, error: 'Rate limiting is not configured.' },
        { status: 503 }
      )
    }

    return memoryRateLimit(req, type)
  }

  const key = `${type}:${getClientIp(req)}`
  const result = await limiter.limit(key)

  if (!result.success) {
    const retryAfterSeconds = Math.ceil((result.reset - Date.now()) / 1000)
    return tooManyRequests(limit, retryAfterSeconds, result.remaining)
  }

  return null
}
