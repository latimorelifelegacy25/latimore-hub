'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BRAND } from '@/lib/brand'
import { TrendingUp, Lock, GraduationCap } from 'lucide-react'


const navy = '#0E1A2B'
const gold = '#C9A24D'
const goldLight = '#E5C882'
const navLinks: [string, string][] = [['/', 'Home'], ['/about', 'About'], ['/products', 'Products'], ['/services', 'Services'], ['/education', 'Education'], ['/contact', 'Contact']]

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <nav style={{ background: navy, padding: '1rem 0', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>
          <img src="/logo.jpg" alt="Logo" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
          {BRAND.name}
        </Link>
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(([href, label]) => (
            <Link key={href} href={href} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem' }}>{label}</Link>
          ))}
          <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer" style={{ background: gold, color: navy, padding: '0.5rem 1rem', borderRadius: 5, fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}>Book Consultation</a>
          <a href={BRAND.ethosUrl} target="_blank" rel="noopener noreferrer" style={{ background: goldLight, color: navy, padding: '0.5rem 1rem', borderRadius: 5, fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem' }}>Get Quote</a>
        </div>
        <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }} className="mobile-btn">{open ? 'Close' : 'Menu'}</button>
      </div>
      {open && (
        <div style={{ background: navy, padding: '1rem 20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {navLinks.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>{label}</Link>
          ))}
          <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer" style={{ background: gold, color: navy, padding: '0.75rem', borderRadius: 5, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>Book Consultation</a>
          <a href={BRAND.ethosUrl} target="_blank" rel="noopener noreferrer" style={{ background: goldLight, color: navy, padding: '0.75rem', borderRadius: 5, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>Get Quote</a>
        </div>
      )}
      <style>{`@media(max-width:900px){.desktop-nav{display:none !important;}.mobile-btn{display:block !important;}}`}</style>
    </nav>
  )
}

function Footer() {
  return (
    <footer style={{ background: navy, color: '#fff', padding: '3rem 0 1rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ color: goldLight, marginBottom: '1rem' }}>{BRAND.name}</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7 }}>Protection-first strategies for working families across Central Pennsylvania.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              {[['Instagram', BRAND.instagram], ['LinkedIn', BRAND.linkedin], ['Facebook', BRAND.facebook]].map(([l, h]) => (
                <a key={l} href={h} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem' }}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: goldLight, marginBottom: '1rem' }}>Quick Links</h4>
            {navLinks.map(([h, l]) => <Link key={h} href={h} style={{ display: 'block', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{l}</Link>)}
          </div>
          <div>
            <h4 style={{ color: goldLight, marginBottom: '1rem' }}>Contact</h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>{BRAND.phone}</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{BRAND.email}</p>
          </div>
          <div>
            <h4 style={{ color: goldLight, marginBottom: '1rem' }}>Get Started</h4>
            <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: gold, color: navy, padding: '0.5rem 1rem', borderRadius: 5, fontWeight: 600, textDecoration: 'none', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Book Consultation</a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', maxWidth: 900, margin: '0 auto 0.75rem' }}>
            Licensed in Pennsylvania (DOI #{BRAND.paLicense}, NIPR #{BRAND.nipr}). Independent contractor affiliated with Global Financial Impact. For educational purposes only; not tax or legal advice.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>© {new Date().getFullYear()} Latimore Life & Legacy LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

const services = [
  {
    number: '01',
    icon: <TrendingUp size={28} />,
    title: 'Tax-Advantaged Wealth Accumulation',
    who: 'Working professionals, self-employed individuals, high earners',
    summary: 'Build wealth using vehicles that grow tax-deferred or tax-free — reducing what you pay the IRS over your lifetime while building a stronger financial foundation.',
    points: [
      'Indexed and fixed strategies that grow without market risk',
      'Tax-deferred accumulation inside annuities and permanent life policies',
      'Tax-free distributions via policy loans for retirement income',
      'Reduces your taxable estate over time',
      'Complements — not replaces — your existing 401(k) or IRA',
    ],
  },
  {
    number: '02',
    icon: <Lock size={28} />,
    title: 'Asset Protection & Plan Rollovers',
    who: 'Job changers, retirees, anyone with a 401(k), 403(b), or pension',
    summary: 'When you leave a job or retire, your retirement funds need a safe destination. A strategic rollover protects your principal, avoids unnecessary taxes, and positions your money for growth.',
    points: [
      'Tax-free, penalty-free 401(k) and 403(b) rollover guidance',
      'Pension lump-sum vs. annuity analysis',
      'Principal protection from market volatility',
      'Guaranteed growth options through fixed vehicles',
      'Retain control of your funds without employer restrictions',
    ],
  },
  {
    number: '03',
    icon: <GraduationCap size={28} />,
    title: 'College Education Funding',
    who: 'Parents and grandparents planning ahead for a child\'s education',
    summary: 'Fund higher education without putting your retirement at risk or burdening a child with debt — using strategies that grow tax-free and remain flexible if plans change.',
    points: [
      'Cash-value life insurance as a flexible education savings vehicle',
      'No restrictions on how funds are used — not just tuition',
      'Tax-free access via policy loans when needed',
      'May not count against financial aid eligibility the same way as other assets',
      'Funds remain available for other purposes if the child does not attend college',
    ],
  },
  {
    number: '04',
    icon: '',
    title: 'Debt Management',
    who: 'Families carrying high-interest debt limiting their financial progress',
    summary: 'High-interest debt is one of the biggest barriers to building wealth. Strategic planning can free up cash flow and redirect it toward protection and growth.',
    points: [
      'Identify which debts to prioritize and in what order',
      'Use policy cash value to consolidate or eliminate debt',
      'Free up monthly cash flow for savings and protection',
      'Build a foundation that does not collapse under unexpected expenses',
      'Coordination with life insurance and living benefit strategies',
    ],
  },
  {
    number: '05',
    icon: '',
    title: 'Life Insurance & Living Benefits',
    who: 'Individuals and families at any stage of life',
    summary: 'Life insurance is the foundation of financial protection — and modern policies do more than pay a death benefit. Living benefit riders allow you to access your policy during a health crisis.',
    points: [
      'Term, whole life, and indexed universal life options',
      'Critical illness, chronic illness, and terminal illness accelerated benefit riders',
      'Income replacement for your family if you pass away',
      'Final expense coverage to prevent burial costs falling on loved ones',
      'Disability waiver of premium to keep coverage in force if you cannot work',
    ],
  },
  {
    number: '06',
    icon: '',
    title: 'Estate & Legacy Planning',
    who: 'Business owners, property owners, and families wanting to transfer wealth',
    summary: 'How you transfer wealth matters as much as how you build it. A proper estate strategy ensures your assets go to who you intend — without being eroded by taxes, probate, or delays.',
    points: [
      'Life insurance as a tax-free wealth transfer vehicle',
      'Beneficiary designation review and optimization',
      'Strategies to minimize estate tax exposure',
      'Funding for buy-sell agreements between business partners',
      'Coordination with your attorney for wills and trusts',
    ],
  },
  {
    number: '07',
    icon: '',
    title: 'Indexed Growth Strategies',
    who: 'Savers and pre-retirees who want market-linked growth without market risk',
    summary: 'Indexed products track market performance while protecting your principal with a floor. You participate in upside when markets rise — and lose nothing when they fall.',
    points: [
      'Cash value linked to indexes like the S&P 500',
      'Zero-loss floor — market drops cannot reduce your balance',
      'Participation rates and cap rates determine your share of index gains',
      'Available inside both indexed universal life and fixed indexed annuities',
      'Tax-deferred growth throughout the accumulation phase',
    ],
  },
  {
    number: '08',
    icon: '',
    title: 'Mortgage Protection',
    who: 'Homeowners with a mortgage and dependents relying on their income',
    summary: 'If you pass away unexpectedly, your family should not lose the home. Mortgage protection ensures the bank is paid and your family stays where they built their life.',
    points: [
      'Coverage designed to match your mortgage balance',
      'Pays directly to your beneficiary — not the lender',
      'Many policies include return-of-premium options',
      'Living benefit riders available on many mortgage protection policies',
      'Affordable coverage often available without a full medical exam',
    ],
  },
  {
    number: '09',
    icon: '',
    title: 'Business & Key-Person Insurance',
    who: 'Small business owners, partnerships, and organizations dependent on key staff',
    summary: 'The sudden loss of a key employee or owner can devastate a business. Key-person insurance provides the capital to survive, restructure, or recruit and train a replacement.',
    points: [
      'Policy owned by the business on a critical employee or owner',
      'Tax-free death benefit received directly by the business',
      'Funds buy-sell agreements between partners',
      'Covers revenue loss, loan obligations, and recruitment costs',
      'Can be used to attract and retain key talent as a benefit',
    ],
  },
  {
    number: '10',
    icon: '',
    title: 'Retirement Income Strategies',
    who: 'Pre-retirees and retirees wanting guaranteed income they cannot outlive',
    summary: 'Running out of money in retirement is one of the most significant financial risks Americans face. Guaranteed income strategies remove that fear entirely.',
    points: [
      'Fixed and fixed-indexed annuities for principal-protected accumulation',
      'Guaranteed lifetime income riders — payments you cannot outlive',
      'Structured to complement Social Security and other retirement income',
      'Eliminate sequence-of-returns risk in your retirement portfolio',
      'Joint life options to protect a surviving spouse',
    ],
  },
]

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

        {/* Header */}
        <section style={{ background: `linear-gradient(135deg, ${navy} 0%, #1a2942 100%)`, color: '#fff', padding: '4rem 0', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
            <p style={{ color: goldLight, fontWeight: 600, letterSpacing: 2, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1rem' }}>What We Do</p>
            <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              10 Strategies to<br /><span style={{ color: goldLight }}>Build, Protect & Transfer Wealth</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              As an independent consultant, every strategy is customized to your income, family situation, and goals — not a product quota.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer" style={{ background: gold, color: navy, padding: '0.9rem 2rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none' }}>Book Free Consultation</a>
              <a href={BRAND.ethosUrl} target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', color: '#fff', border: `2px solid ${gold}`, padding: '0.9rem 2rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none' }}>Get Instant Quote</a>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section style={{ padding: '4rem 0', background: '#F5F5F5' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '2rem' }}>
              {services.map((s) => (
                <div key={s.number} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ background: navy, padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                      <span style={{ color: gold, fontWeight: 800, fontSize: '1.1rem' }}>{s.number}</span>
                      <span style={{ fontSize: '1.8rem' }}>{s.icon}</span>
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.4rem', lineHeight: 1.3 }}>{s.title}</h2>
                    <p style={{ color: goldLight, fontSize: '0.8rem' }}>Best for: {s.who}</p>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <p style={{ color: '#444', lineHeight: 1.7, marginBottom: '1.25rem', fontSize: '0.95rem' }}>{s.summary}</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {s.points.map((p, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.5rem', color: '#333', fontSize: '0.88rem', lineHeight: 1.5 }}>
                          <span style={{ color: gold, fontWeight: 700, flexShrink: 0 }}></span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section style={{ background: navy, padding: '4rem 0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ textAlign: 'center', color: '#fff', fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: '3rem' }}>Who We Serve</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
              {[
                ['‍‍', 'Young Families', 'Income replacement, mortgage protection, and starting a savings strategy before costs rise with age.'],
                ['', 'Pre-Retirees', '401(k) rollovers, safe-money accumulation, and guaranteed lifetime income planning.'],
                ['', 'Business Owners', 'Key-person coverage, buy-sell funding, and executive benefit strategies.'],
                ['', 'Local Organizations', 'Key-person insurance for school districts, nonprofits, and municipal employers.'],
                ['‍', 'Healthcare Workers', 'Disability protection, living benefits, and retirement income for shift workers.'],
                ['', 'Trade Workers', 'Affordable term coverage, final expense planning, and mortgage protection for skilled trades.'],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${gold}30`, borderRadius: 10, padding: '1.5rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
                  <h3 style={{ color: goldLight, fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section style={{ background: '#fff', padding: '4rem 0' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ textAlign: 'center', color: navy, fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: '3rem' }}>How It Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1.5rem' }}>
              {[
                ['01', 'Free Consultation', 'We talk through your goals, family situation, and any existing coverage — no forms, no pressure.'],
                ['02', 'Needs Analysis', 'I identify gaps, run numbers across carriers, and build a clear picture of your options.'],
                ['03', 'Plain-Language Proposal', 'You receive a simple breakdown of recommendations — costs, benefits, and what each strategy does.'],
                ['04', 'You Decide', 'No high-pressure close. You choose what fits on your timeline and budget.'],
                ['05', 'Ongoing Support', 'I remain your point of contact for policy reviews, changes, and future planning needs.'],
              ].map(([num, title, desc]) => (
                <div key={num} style={{ background: '#F9F9F9', borderRadius: 10, padding: '1.5rem', borderTop: `3px solid ${gold}` }}>
                  <div style={{ color: gold, fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.5rem' }}>{num}</div>
                  <h3 style={{ color: navy, fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h3>
                  <p style={{ color: '#666', fontSize: '0.88rem', lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: `linear-gradient(135deg, ${gold} 0%, ${goldLight} 100%)`, padding: '4rem 0', textAlign: 'center' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ color: navy, fontSize: 'clamp(1.5rem,3vw,2.2rem)', marginBottom: '1rem' }}>Not Sure Where to Start?</h2>
            <p style={{ color: navy, fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.7 }}>
              Most people discover they are either over-insured in the wrong areas or completely unprotected where it matters most. A free consultation clears that up in 30 minutes.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer" style={{ background: navy, color: '#fff', padding: '1rem 2rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none' }}>Book Free Consultation</a>
              <a href={`tel:${BRAND.phoneRaw}`} style={{ background: 'transparent', color: navy, border: `2px solid ${navy}`, padding: '1rem 2rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none' }}>Call {BRAND.phone}</a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
