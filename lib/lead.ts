function browserSafeUUID(): string {
  if (typeof window === 'undefined') return ''
  return (self as any).crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
}

// Client-side lead session ID (persisted in localStorage)
export function ensureLeadSessionId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'lead_session_id'
  let value = localStorage.getItem(key)
  if (!value) {
    value = `sess_${browserSafeUUID()}`
    localStorage.setItem(key, value)
  }
  return value
}

// Capture UTM params from current URL
export function captureUtms(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
  const out: Record<string, string> = {}

  for (const key of keys) {
    const value = params.get(key)
    if (value) out[key] = value
  }

  const referrer = params.get('referrer') || (typeof document !== 'undefined' ? document.referrer : '') || ''
  if (referrer) out.referrer = referrer

  return out
}

export function getEventContext(overrides: Partial<{
  pageUrl: string
  source: string
  medium: string
  campaign: string
  term: string
  content: string
  referrer: string
  county: string
  productInterest: string
}> = {}) {
  const utms = captureUtms()
  return {
    leadSessionId: ensureLeadSessionId(),
    pageUrl: overrides.pageUrl ?? (typeof window !== 'undefined' ? window.location.pathname : ''),
    source: overrides.source ?? utms.utm_source ?? null,
    medium: overrides.medium ?? utms.utm_medium ?? null,
    campaign: overrides.campaign ?? utms.utm_campaign ?? null,
    term: overrides.term ?? utms.utm_term ?? null,
    content: overrides.content ?? utms.utm_content ?? null,
    referrer: overrides.referrer ?? utms.referrer ?? null,
    county: overrides.county ?? null,
    productInterest: overrides.productInterest ?? null,
  }
}

// Build hidden field string for Fillout embed
export function buildFilloutParams(extra: Record<string, string> = {}): string {
  const context = getEventContext()
  const params = {
    lead_session_id: context.leadSessionId,
    utm_source: context.source ?? '',
    utm_medium: context.medium ?? '',
    utm_campaign: context.campaign ?? '',
    utm_term: context.term ?? '',
    utm_content: context.content ?? '',
    referrer: context.referrer ?? '',
    page_url: context.pageUrl ?? '',
    ...extra,
  }

  return new URLSearchParams(
    Object.entries(params).filter(([, value]) => value)
  ).toString()
}
