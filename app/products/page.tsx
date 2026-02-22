'use client'

import { useState } from 'react'
import Link from 'next/link'

const BRAND = {
  name: 'Latimore Life & Legacy',
  phone: '(856) 895-1457',
  phoneRaw: '8568951457',
  email: 'jackson1989@latimorelegacy.com',
  paLicense: '1268820',
  nipr: '21638507',
  bookingUrl: 'https://globalfinancialimpact.fillout.com/t/tMz7ZcqpaZus',
  ethosUrl: 'https://agents.ethoslife.com/invite/29ad1',
  instagram: 'https://www.instagram.com/jacksonlatimore.global',
  linkedin: 'https://www.linkedin.com/in/startwithjacksongfi',
  facebook: 'https://www.facebook.com/LatimoreLegacyLL',
}

const navy = '#0E1A2B'
const gold = '#C9A24D'
const goldLight = '#E5C882'

const lifeProducts = [
  {
    title: 'Term Coverage',
    tag: 'Most Affordable',
    tagColor: '#2ecc71',
    icon: '🛡️',
    who: 'Young families, new homeowners, income replacement',
    summary: 'Maximum protection at the lowest possible cost. Coverage runs for a set period — typically 10 to 30 years — and pays a tax-free death benefit if you pass during that time.',
    features: [
      'Lowest monthly premium of any life insurance type',
      'Tax-free death benefit paid directly to your beneficiary',
      'Ideal for covering a mortgage, income replacement, or raising children',
      'Convertible to permanent coverage in many cases',
      'Easy online application — some policies issue same day',
    ],
    cta: { label: 'Get Instant Quote', href: BRAND.ethosUrl, style: 'outline' },
  },
  {
    title: 'Permanent Whole Life',
    tag: 'Guaranteed Growth',
    tagColor: gold,
    icon: '🏦',
    who: 'Families wanting lifelong coverage with a savings component',
    summary: 'Coverage that never expires as long as premiums are paid. Builds guaranteed cash value over time that you can borrow against tax-free — a financial asset, not just a policy.',
    features: [
      'Lifetime coverage — never expires, never changes in cost',
      'Builds guaranteed cash value every single year',
      'Tax-free policy loans available for emergencies or opportunities',
      'Potential to earn dividends with participating policies',
      'Protects your insurability regardless of future health changes',
    ],
    cta: { label: 'Book a Consultation', href: BRAND.bookingUrl, style: 'solid' },
  },
  {
    title: 'Indexed Universal Life',
    tag: 'Growth + Protection',
    tagColor: '#3498db',
    icon: '📈',
    who: 'Professionals, business owners, high earners building tax-free wealth',
    summary: 'Permanent life insurance with a cash value that grows based on a market index — without being directly in the market. You get upside potential with a floor that prevents losses.',
    features: [
      'Cash value linked to market index performance (not directly invested)',
      'Zero-loss floor — your cash value cannot decrease due to market drops',
      'Flexible premiums adjustable to your income and goals',
      'Tax-free retirement income via policy loans',
      'Living benefits: access funds if diagnosed with critical illness',
      'Overfund strategy for high cash accumulation',
    ],
    cta: { label: 'Book a Consultation', href: BRAND.bookingUrl, style: 'solid' },
  },
  {
    title: 'Final Expense & Burial Coverage',
    tag: 'Easy to Qualify',
    tagColor: '#9b59b6',
    icon: '🤝',
    who: 'Seniors, those with health conditions, anyone wanting to protect family from end-of-life costs',
    summary: 'Smaller face-amount whole life policy designed specifically to cover funeral costs, medical bills, and final debts. No medical exam. Simplified underwriting.',
    features: [
      'No medical exam required — simplified health questions only',
      'Designed for ages 45–85',
      'Covers funeral, burial, and end-of-life expenses',
      'Benefit paid directly to family — used however needed',
      'Premiums never increase, coverage never decreases',
      'Builds cash value over time',
    ],
    cta: { label: 'Book a Consultation', href: BRAND.bookingUrl, style: 'solid' },
  },
]

const annuityProducts = [
  {
    title: 'Fixed Annuity',
    tag: 'Safe Money',
    tagColor: '#2ecc71',
    icon: '🔒',
    who: 'Conservatives savers, pre-retirees, those rolling over 401(k) or pension funds',
    summary: 'A contract with an insurance company that guarantees a fixed interest rate on your money for a set period. Principal is protected. Growth is guaranteed. No market risk.',
    features: [
      'Guaranteed interest rate — locked in at time of purchase',
      'Principal 100% protected — cannot lose money',
      'Tax-deferred growth — no taxes until you withdraw',
      'Ideal for 401(k), 403(b), and pension rollovers',
      'No annual fees in most cases',
      'Multi-year guarantee options (MYGAs) available',
    ],
    cta: { label: 'Book a Consultation', href: BRAND.bookingUrl, style: 'solid' },
  },
  {
    title: 'Fixed Indexed Annuity',
    tag: 'Growth + Safety',
    tagColor: gold,
    icon: '⚖️',
    who: 'Pre-retirees who want more than a fixed rate but cannot afford to lose principal',
    summary: 'Your money grows based on a market index like the S&P 500, but is never directly invested in the market. A floor prevents losses. A cap or participation rate limits gains — but your principal is always safe.',
    features: [
      'Market-linked growth potential without direct market exposure',
      'Zero-loss floor — index drops cannot reduce your balance',
      'Tax-deferred accumulation throughout the growth phase',
      'Optional guaranteed lifetime income rider',
      'Penalty-free withdrawal provisions typically available',
      'Can be funded with IRA, 401(k), or after-tax dollars',
    ],
    cta: { label: 'Book a Consultation', href: BRAND.bookingUrl, style: 'solid' },
  },
  {
    title: 'Income Annuity',
    tag: 'Guaranteed Income',
    tagColor: '#3498db',
    icon: '💵',
    who: 'Retirees or near-retirees who need predictable monthly income they cannot outlive',
    summary: 'Convert a lump sum into a guaranteed stream of income — monthly, quarterly, or annually — for life or a set period. Eliminates the fear of outliving your savings.',
    features: [
      'Guaranteed income you cannot outlive',
      'Payments begin immediately or at a future date (deferred income)',
      'Spouse/joint life options available',
      'Eliminates sequence-of-returns risk in retirement',
      'Predictable, inflation-adjustable payment options',
      'Backed by the financial strength of the issuing carrier',
    ],
    cta: { label: 'Book a Consultation', href: BRAND.bookingUrl, style: 'solid' },
  },
]

const livingBenefits = [
  { icon: '🫀', title: 'Critical Illness', desc: 'Lump-sum benefit if diagnosed with a covered condition such as heart attack, stroke, or cancer — paid while you are still alive.' },
  { icon: '🏥', title: 'Chronic Illness', desc: 'Accelerate a portion of your death benefit if you cannot perform two or more activities of daily living due to a long-term condition.' },
  { icon: '⚠️', title: 'Terminal Illness', desc: 'Access a portion of your death benefit early if diagnosed with a terminal condition — use it however your family needs most.' },
  { icon: '🦽', title: 'Disability Waiver', desc: 'Premiums are waived if you become totally disabled, keeping your coverage in force without out-of-pocket cost.' },
]

function ProductCard({ p, index }: { p: typeof lifeProducts[0], index: number }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden', border: `1px solid rgba(0,0,0,0.06)` }}>
      <div style={{ background: navy, padding: '1.5rem', position: 'relative' }}>
        <span style={{ background: p.tagColor, color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>{p.tag}</span>
        <div style={{ fontSize: '2.5rem', marginTop: '0.75rem' }}>{p.icon}</div>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', marginTop: '0.5rem', marginBottom: '0.25rem' }}>{p.title}</h3>
        <p style={{ color: goldLight, fontSize: '0.85rem' }}>Best for: {p.who}</p>
      </div>
      <div style={{ padding: '1.5rem' }}>
        <p style={{ color: '#444', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.97rem' }}>{p.summary}</p>
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.75rem' }}>
          {p.features.map((f, i) => (
            <li key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem', color: '#333', fontSize: '0.92rem', lineHeight: 1.5 }}>
              <span style={{ color: gold, flexShrink: 0, fontWeight: 700 }}>✓</span>
              {f}
            </li>
          ))}
        </ul>
        <a href={p.cta.href} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'block', textAlign: 'center', textDecoration: 'none', fontWeight: 700,
            padding: '0.85rem 1.5rem', borderRadius: 6,
            background: p.cta.style === 'solid' ? gold : 'transparent',
            color: p.cta.style === 'solid' ? navy : navy,
            border: p.cta.style === 'outline' ? `2px solid ${gold}` : 'none',
          }}>
          {p.cta.label}
        </a>
      </div>
    </div>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  const navLinks: [string, string][] = [['/', 'Home'], ['/about', 'About'], ['/products', 'Products'], ['/services', 'Services'], ['/education', 'Education'], ['/contact', 'Contact']]
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
        <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }} className="mobile-btn">{open ? '✕' : '☰'}</button>
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
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7 }}>Protection-first strategies for working families and local organizations across Central Pennsylvania.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {[['Instagram', BRAND.instagram], ['LinkedIn', BRAND.linkedin], ['Facebook', BRAND.facebook]].map(([l, h]) => (
                <a key={l} href={h} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem' }}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: goldLight, marginBottom: '1rem' }}>Quick Links</h4>
            {[['/about','About'],['/products','Products'],['/services','Services'],['/contact','Contact']].map(([h, l]) => (
              <Link key={h} href={h} style={{ display: 'block', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{l}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: goldLight, marginBottom: '1rem' }}>Contact</h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>{BRAND.phone}</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>{BRAND.email}</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Schuylkill, Luzerne & Northumberland Counties, PA</p>
          </div>
          <div>
            <h4 style={{ color: goldLight, marginBottom: '1rem' }}>Get Started</h4>
            <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: gold, color: navy, padding: '0.5rem 1rem', borderRadius: 5, fontWeight: 600, textDecoration: 'none', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Book Consultation</a><br />
            <a href={BRAND.ethosUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: gold, color: navy, padding: '0.5rem 1rem', borderRadius: 5, fontWeight: 600, textDecoration: 'none', marginBottom: '1rem', fontSize: '0.9rem' }}>Instant Quote</a>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '0.4rem' }}>Scan to apply:</p>
              <img src="/ethos-qr.png" alt="Ethos QR" style={{ width: 72, height: 72, borderRadius: 6 }} />
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', maxWidth: 900, margin: '0 auto 0.75rem' }}>
            Licensed in Pennsylvania (DOI #{BRAND.paLicense}, NIPR #{BRAND.nipr}). Independent contractor affiliated with Global Financial Impact. Products offered through appointed carriers. For educational purposes only; not tax or legal advice.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>© {new Date().getFullYear()} Latimore Life & Legacy LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function ProductsPage() {
  return (
    <>
      <Nav />
      <main style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

        {/* Page Header */}
        <section style={{ background: `linear-gradient(135deg, ${navy} 0%, #1a2942 100%)`, color: '#fff', padding: '4rem 0', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
            <p style={{ color: goldLight, fontWeight: 600, letterSpacing: 2, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Financial Protection Portfolio</p>
            <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '1.25rem', lineHeight: 1.2 }}>Products Designed to<br /><span style={{ color: goldLight }}>Protect, Grow & Transfer</span> Wealth</h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, marginBottom: '2rem' }}>
              As an independent consultant, I work with multiple top-rated carriers to find the right solution for your specific situation — not a one-size-fits-all product.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer" style={{ background: gold, color: navy, padding: '0.9rem 2rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none' }}>Book Free Consultation</a>
              <a href={BRAND.ethosUrl} target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', color: '#fff', border: `2px solid ${gold}`, padding: '0.9rem 2rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none' }}>Get Instant Quote</a>
            </div>
          </div>
        </section>

        {/* Why Independent */}
        <section style={{ background: '#fff', padding: '3rem 0', borderBottom: `4px solid ${gold}` }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.5rem', textAlign: 'center' }}>
              {[
                ['🏢', 'Multiple Carriers', 'Access to dozens of top-rated insurance companies — not locked into one.'],
                ['🎯', 'Needs-Based Matching', 'Every recommendation starts with your goals, budget, and health profile.'],
                ['📋', 'No Sales Quotas', 'Independent means no pressure to push a specific product or company.'],
                ['🔍', 'Full Transparency', 'You understand exactly what you are buying, what it costs, and why.'],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ padding: '1.5rem', background: '#F9F9F9', borderRadius: 10, borderTop: `3px solid ${gold}` }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
                  <h3 style={{ color: navy, fontSize: '1.05rem', marginBottom: '0.5rem' }}>{title}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Life Insurance Section */}
        <section style={{ padding: '4rem 0', background: '#F5F5F5' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ color: gold, fontWeight: 700, letterSpacing: 2, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Category 01</p>
              <h2 style={{ color: navy, fontSize: 'clamp(1.6rem,4vw,2.4rem)', marginBottom: '1rem' }}>Life Insurance</h2>
              <p style={{ color: '#666', fontSize: '1.05rem', maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>
                Life insurance is the foundation of any solid financial protection plan. Whether you need temporary coverage or a permanent asset that builds tax-free wealth, there is a solution for every stage of life.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2rem' }}>
              {lifeProducts.map((p, i) => <ProductCard key={i} p={p} index={i} />)}
            </div>
          </div>
        </section>

        {/* Living Benefits Callout */}
        <section style={{ background: navy, padding: '4rem 0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <p style={{ color: goldLight, fontWeight: 700, letterSpacing: 2, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Included with Many Policies</p>
              <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem,4vw,2.2rem)', marginBottom: '1rem' }}>Living Benefits — Use Your Policy While You Are Alive</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>
                Many of the policies I offer include riders that allow you to access your death benefit early if you experience a serious health event. Life insurance is not just for death.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
              {livingBenefits.map((b, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid rgba(201,162,77,0.3)`, borderRadius: 10, padding: '1.5rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{b.icon}</div>
                  <h3 style={{ color: goldLight, fontSize: '1rem', marginBottom: '0.5rem' }}>{b.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', lineHeight: 1.7 }}>{b.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer" style={{ background: gold, color: navy, padding: '1rem 2.5rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
                Ask About Living Benefits on Your Policy
              </a>
            </div>
          </div>
        </section>

        {/* Annuities Section */}
        <section style={{ padding: '4rem 0', background: '#F5F5F5' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ color: gold, fontWeight: 700, letterSpacing: 2, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Category 02</p>
              <h2 style={{ color: navy, fontSize: 'clamp(1.6rem,4vw,2.4rem)', marginBottom: '1rem' }}>Annuities & Retirement Income</h2>
              <p style={{ color: '#666', fontSize: '1.05rem', maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>
                Annuities are insurance products — not securities — that protect your retirement savings from market risk while providing growth and guaranteed income options you cannot outlive.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2rem' }}>
              {annuityProducts.map((p, i) => <ProductCard key={i} p={p} index={i} />)}
            </div>
          </div>
        </section>

        {/* Rollover Callout */}
        <section style={{ background: '#fff', padding: '3.5rem 0', borderTop: `4px solid ${gold}` }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔄</div>
            <h2 style={{ color: navy, fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: '1rem' }}>Leaving a Job? Rolling Over a 401(k) or Pension?</h2>
            <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: 700, margin: '0 auto 1.5rem' }}>
              A job change or retirement is one of the most important financial moments of your life. Rolling funds into the wrong vehicle can cost you thousands in taxes and fees. I help you move money safely, tax-efficiently, and into a vehicle that matches your retirement goals.
            </p>
            <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer" style={{ background: gold, color: navy, padding: '1rem 2.5rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none', fontSize: '1rem', display: 'inline-block' }}>
              Talk Through Your Rollover Options
            </a>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ background: '#F5F5F5', padding: '4rem 0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ textAlign: 'center', color: navy, fontSize: 'clamp(1.6rem,4vw,2.2rem)', marginBottom: '3rem' }}>How We Find the Right Product for You</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem' }}>
              {[
                ['01', 'Discovery Call', 'We talk through your goals, current coverage gaps, income, health, and timeline — no forms, no pressure.'],
                ['02', 'Needs Analysis', 'I run a full analysis of your situation and shop multiple carriers to find the best fit for your budget and goals.'],
                ['03', 'Clear Proposal', 'You receive a plain-language breakdown of your options — costs, benefits, and what each policy actually does.'],
                ['04', 'You Decide', 'No high-pressure tactics. You choose what makes sense, on your timeline, with full understanding of what you are buying.'],
                ['05', 'Ongoing Support', 'I remain your point of contact for policy questions, changes, and future planning needs — for as long as you need me.'],
              ].map(([num, title, desc]) => (
                <div key={num} style={{ background: '#fff', borderRadius: 10, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: `3px solid ${gold}` }}>
                  <div style={{ color: gold, fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.5rem' }}>{num}</div>
                  <h3 style={{ color: navy, fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h3>
                  <p style={{ color: '#666', fontSize: '0.88rem', lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ background: `linear-gradient(135deg, ${gold} 0%, ${goldLight} 100%)`, padding: '4rem 0', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ color: navy, fontSize: 'clamp(1.6rem,4vw,2.4rem)', marginBottom: '1rem' }}>Not Sure Which Product Is Right for You?</h2>
            <p style={{ color: navy, fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.7 }}>
              That is exactly what the consultation is for. Most people are either over-insured in the wrong areas or completely unprotected where it matters most. Let&apos;s fix that.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer" style={{ background: navy, color: '#fff', padding: '1rem 2.5rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
                Book Free Consultation
              </a>
              <a href={BRAND.ethosUrl} target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', color: navy, border: `2px solid ${navy}`, padding: '1rem 2.5rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
                Get Instant Quote
              </a>
              <a href={`tel:${BRAND.phoneRaw}`} style={{ background: 'transparent', color: navy, border: `2px solid ${navy}`, padding: '1rem 2.5rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
                Call {BRAND.phone}
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
