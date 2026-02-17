import Link from 'next/link'
import { CheckCircle2, Calendar } from 'lucide-react'
import { BRAND } from '@/lib/brand'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-xl">
        <div className="w-16 h-16 bg-[#C9A25F]/15 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#C9A25F]" />
        </div>
        <p className="micro-label text-[#C9A25F] mb-4">{BRAND.hashtag}</p>
        <h1 className="heading-display text-[clamp(2rem,5vw,3rem)] text-[#F7F7F5] mb-4">
          We received your request.
        </h1>
        <p className="text-[#A9B1BE] text-lg mb-10">
          {BRAND.advisor} will follow up within 24 hours. If you'd like to choose a time now, grab a slot below.
        </p>
        <Link href="/book" className="cta-gold inline-flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Book Your 30-Minute Slot
        </Link>
        <div className="mt-8">
          <Link href="/" className="text-[#A9B1BE] hover:text-[#C9A25F] text-sm transition-colors">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
