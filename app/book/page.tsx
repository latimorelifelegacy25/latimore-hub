import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BRAND } from '@/lib/brand'

const GCAL_SRC = 'https://calendar.google.com/calendar/appointments/AcZssZ0pWKOYTgg4xc8vleuqTnfpTwqm8oYaG2B5TxA=?gv=true'

export default function BookPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[#A9B1BE] hover:text-[#C9A25F] transition-colors text-sm mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="mb-8">
          <p className="micro-label text-[#C9A25F] mb-3">Start Here</p>
          <h1 className="heading-display text-[clamp(2rem,5vw,3.5rem)] text-[#F7F7F5]">Secure Your Legacy</h1>
          <p className="text-[#A9B1BE] mt-3 text-lg">
            Select a 30-minute slot below. {BRAND.advisor} will confirm and prepare for your call.
          </p>
        </div>
        <div className="bg-[#1a2535] rounded-2xl overflow-hidden border border-[#F7F7F5]/6">
          <iframe
            src={GCAL_SRC}
            style={{ border: 0 }}
            width="100%"
            height={800}
            title="Secure Your Legacy with Latimore Life & Legacy"
          />
        </div>
        <p className="text-[#A9B1BE]/50 text-xs mt-4 text-center">
          Prefer email? <a href={`mailto:${BRAND.email}`} className="text-[#C9A25F] hover:underline">{BRAND.email}</a>
        </p>
      </div>
    </div>
  )
}
