'use client'
import { useMemo, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { buildFilloutParams, ensureLeadSessionId } from '@/lib/lead'
import { BRAND } from '@/lib/brand'

export default function ConsultPage() {
  useEffect(() => { ensureLeadSessionId() }, [])

  const src = useMemo(() => {
    const params = buildFilloutParams()
    return `${BRAND.filloutUrl}?${params}`
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0F17]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[#A9B1BE] hover:text-[#C9A25F] transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="mb-8">
          <p className="micro-label text-[#C9A25F] mb-3">No Pressure · No Jargon</p>
          <h1 className="heading-display text-[clamp(2rem,5vw,3.5rem)] text-[#F7F7F5]">Request a Free Consultation</h1>
          <p className="text-[#A9B1BE] mt-3 text-lg">A 30-minute conversation about your priorities. We'll listen first, then educate.</p>
        </div>
        <div className="bg-[#1a2535] rounded-2xl overflow-hidden border border-[#F7F7F5]/6">
          <iframe src={src} width="100%" height={900} style={{ border: 0 }} title="Request a Consultation" />
        </div>
        <p className="text-[#A9B1BE]/50 text-xs mt-4 text-center">
          Insurance products vary by carrier and state. No rate or return promises. PA License #{BRAND.paLicense}
        </p>
      </div>
    </div>
  )
}
