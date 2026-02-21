// Client-side lead session ID (persisted in localStorage)
export function ensureLeadSessionId(): string {
  if (typeof window === 'undefined') return ''
  const k = 'lead_session_id'
  let v = localStorage.getItem(k)
  if (!v) {
    v = ((self as any).crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)) as string
    localStorage.setItem(k, v as string)
  }
  return v
}

// Capture UTM params from current URL
export function captureUtms(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(location.search)
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'referrer']
  const out: Record<string, string> = {}
  keys.forEach((k) => {
    const v = p.get(k)
    if (v) out[k] = v
  })
  return out
}

// Build hidden field string for Fillout embed
export function buildFilloutParams(): string {
  const params = {
    lead_session_id: ensureLeadSessionId(),
    ...captureUtms(),
  }
  return new URLSearchParams(params).toString()
}
