'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { useEffect } from 'react'

export default function ConsultPage() {
  useEffect(() => {
    // Load Fillout embed script
    const script = document.createElement('script')
    script.src = 'https://server.fillout.com/embed/v1/'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0F17]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[#A9B1BE] hover:text-[#C9A25F] transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="mb-8">
          <p className="micro-label text-[#C9A25F] mb-3">No Pressure · No Jargon</p>
          <h1 className="heading-display text-[clamp(2rem,5vw,3.5rem)] text-[#F7F7F5]">Request a Free Consultation</h1>
          <p className="text-[#A9B1BE] mt-3 text-lg">A 30-minute conversation about your priorities. We'll listen first, then educate.</p>
        </div>
        <div className="bg-[#1a2535] rounded-2xl overflow-hidden border border-[#F7F7F5]/6 p-2">
          <div
            style={{ width: '100%', height: '500px' }}
            data-fillout-id="tMz7ZcqpaZus"
            data-fillout-embed-type="standard"
            data-fillout-inherit-parameters
            data-fillout-dynamic-resize
          />
        </div>
        <p className="text-[#A9B1BE]/50 text-xs mt-4 text-center">
          Insurance products vary by carrier and state. No rate or return promises. PA License #{BRAND.paLicense}
        </p>
      </div>
    </div>
  )
}
