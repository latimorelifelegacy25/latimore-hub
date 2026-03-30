'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BRAND } from '@/lib/brand'
import {
  TrendingUp,
  Lock,
  GraduationCap,
  CreditCard,
  Shield,
  Building2,
  LineChart,
  Home,
  Users,
  Wallet,
  Menu,
  X,
  Baby,
  Target,
  Briefcase,
  Landmark,
  HeartPulse,
  Wrench,
  Check,
} from 'lucide-react'

interface Service {
  number: string
  icon: ReactNode
  title: string
  who: string
  summary: string
  points: string[]
}

interface ClientSegment {
  icon: ReactNode
  title: string
  description: string
}

const NAVY = '#0E1A2B'
const GOLD = '#C9A24D'
const GOLD_LIGHT = '#E5C882'

const navLinks: [string, string][] = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/products', 'Products'],
  ['/services', 'Services'],
  ['/education', 'Education'],
  ['/contact', 'Contact'],
]

const services: Service[] = [
  // Your 10 services array — unchanged (it's already excellent)
  {
    number: '01',
    icon: <TrendingUp size={28} aria-hidden="true" />,
    title: 'Tax-Advantaged Wealth Accumulation',
    who: 'Working professionals, self-employed individuals, high earners',
    summary:
      'Build wealth using vehicles that grow tax-deferred or tax-free — reducing what you pay the IRS over your lifetime.',
    points: [
      'Indexed and fixed strategies that grow without market risk',
      'Tax-deferred accumulation inside annuities and permanent life policies',
      'Tax-free distributions via policy loans for retirement income',
      'Reduces your taxable estate over time',
      'Complements — not replaces — your existing 401(k) or IRA',
    ],
  },
  // ... (keep all other 9 services exactly as you had them)
  // I'll omit repeating all 10 here for brevity — copy them from your original
]

const clientSegments: ClientSegment[] = [
  // Your 6 segments — unchanged
]

function CtaButtons({
  centered = false,
  large = false,
}: {
  centered?: boolean
  large?: boolean
}) {
  const paddingClass = large ? 'px-8 py-3' : 'px-4 py-2'
  const textClass = large ? 'text-base' : 'text-sm'

  return (
    <div className={`flex flex-wrap gap-4 ${centered ? 'justify-center' : ''}`}>
      <a
        href={BRAND.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`rounded-md font-bold no-underline transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C9A24D] focus-visible:ring-offset-[#0E1A2B] bg-[#C9A24D] text-[#0E1A2B] ${paddingClass} ${textClass}`}
      >
        Book Free Consultation
      </a>
      <a
        href={BRAND.ethosUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`rounded-md font-bold no-underline transition-all hover:bg-[#C9A24D]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C9A24D] focus-visible:ring-offset-[#0E1A2B] bg-transparent text-white border-2 border-[#C9A24D] ${paddingClass} ${textClass}`}
      >
        Get Instant Quote
      </a>
    </div>
  )
}

// Nav, Footer, ServiceCard, ClientSegmentCard functions remain mostly the same.
// Only small updates below for accuracy and SEO.

function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav
      className="sticky top-0 z-50 shadow-lg"
      style={{ background: NAVY, padding: '1rem 0' }}
      aria-label="Primary navigation"
    >
      {/* Your existing Nav code — no major changes needed */}
      {/* ... (keep your Nav as-is) */}
    </nav>
  )
}

function Footer() {
  return (
    <footer style={{ background: NAVY, color: '#fff', padding: '3rem 0 1rem' }}>
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h2 style={{ color: GOLD_LIGHT }} className="mb-4 font-semibold">
              {BRAND.name}
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Education-first insurance and legacy strategies for families and businesses in Schuylkill, Luzerne, and Northumberland Counties.
            </p>
            <div className="flex gap-4 mt-4">
              {[
                ['Instagram', BRAND.instagram],
                ['LinkedIn', BRAND.linkedin],
                ['Facebook', BRAND.facebook],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 text-sm hover:opacity-80 transition-opacity"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links and Contact sections unchanged */}

          <div>
            <h2 style={{ color: GOLD_LIGHT }} className="mb-4 font-semibold">
              Contact
            </h2>
            <p className="text-white/80 text-sm mb-1">{BRAND.phone}</p>
            <p className="text-white/80 text-sm">{BRAND.email}</p>
            <p className="text-white/80 text-sm mt-2">
              1544 Route 61 Hwy S, Ste 6104, PMB 1022<br />
              Pottsville, PA 17901
            </p>
          </div>

          {/* Get Started section unchanged */}
        </div>

        <div className="border-t border-white/15 pt-6 text-center">
          <p className="text-xs text-white/50 mb-2 max-w-4xl mx-auto">
            Licensed in Pennsylvania (DOI #{BRAND.paLicense}, NPN #{BRAND.nipr}). 
            Independent contractor affiliated with Global Financial Impact. 
            For educational purposes only; not tax or legal advice. Consult your own advisors.
          </p>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Latimore Life &amp; Legacy LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ServiceCard and ClientSegmentCard — your versions are solid, no changes needed.

export default function ServicesPage() {
  return (
    <>
      <Nav />

      <main className="font-sans">
        <section
          className="text-center text-white py-16"
          style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a2942 100%)` }}
        >
          <div className="max-w-3xl mx-auto px-5">
            <p
              className="text-sm font-semibold tracking-widest uppercase mb-4"
              style={{ color: GOLD_LIGHT }}
            >
              What We Do — Central Pennsylvania
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              10 Strategies to
              <br />
              <span style={{ color: GOLD_LIGHT }}>Build, Protect &amp; Transfer Wealth</span>
            </h1>

            <p className="text-white/85 text-lg leading-relaxed mb-8">
              Independent, education-first guidance for families, pre-retirees, and business owners in Schuylkill County and beyond.
            </p>

            <CtaButtons centered large />
          </div>
        </section>

        {/* Services grid and Who We Serve sections — unchanged and strong */}

        <section
          className="py-16 text-center text-white"
          style={{ background: `linear-gradient(135deg, #1a2942 0%, ${NAVY} 100%)` }}
        >
          <div className="max-w-2xl mx-auto px-5">
            <p
              className="text-sm font-semibold tracking-widest uppercase mb-3"
              style={{ color: GOLD_LIGHT }}
            >
              Ready to Start?
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Let&apos;s Build a Strategy
              <br />
              <span style={{ color: GOLD_LIGHT }}>Around Your Life</span>
            </h2>

            <p className="text-white/75 text-lg mb-8 leading-relaxed">
              No pressure. No product quotas. Just an honest conversation about where you are and where you want to go — right here in Central PA.
            </p>

            <CtaButtons centered large />
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
