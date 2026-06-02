'use client'

import { useCallback, useEffect, useRef } from 'react'
import { getEventContext } from '@/lib/lead'

interface ArticleAnalyticsProps {
  slug: string
  title: string
  category: string
}

type ScrollDepth = 'entry' | '50pct' | '95pct'

function wasRecentlyFired(key: string, windowMs = 2000): boolean {
  try {
    const lastFiredAt = Number(window.sessionStorage.getItem(key) ?? 0)
    if (Date.now() - lastFiredAt < windowMs) return true

    window.sessionStorage.setItem(key, String(Date.now()))
    return false
  } catch {
    return false
  }
}

export default function ArticleAnalytics({ slug, title, category }: ArticleAnalyticsProps) {
  const firedEntry = useRef(false)
  const fired50 = useRef(false)
  const fired95 = useRef(false)

  const fire = useCallback(
    (depth: ScrollDepth) => {
      const throttleKey = `latimore:post_viewed:${slug}:${depth}`
      if (wasRecentlyFired(throttleKey)) return

      const ctx = getEventContext({ pageUrl: `/education/blog/${slug}` })

      fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'post_viewed',
          leadSessionId: ctx.leadSessionId,
          pageUrl: ctx.pageUrl,
          referrer: ctx.referrer,
          source: ctx.source,
          medium: ctx.medium,
          campaign: ctx.campaign,
          metadata: { slug, title, category, depth },
        }),
        keepalive: true,
      }).catch(() => undefined)
    },
    [category, slug, title],
  )

  useEffect(() => {
    firedEntry.current = false
    fired50.current = false
    fired95.current = false

    if (!firedEntry.current) {
      firedEntry.current = true
      fire('entry')
    }

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return

      const pct = window.scrollY / total
      if (!fired50.current && pct >= 0.5) {
        fired50.current = true
        fire('50pct')
      }

      if (!fired95.current && pct >= 0.95) {
        fired95.current = true
        fire('95pct')
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fire])

  return null
}
