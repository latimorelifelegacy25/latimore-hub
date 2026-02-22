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
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7 }}>Protection-first strategies for working families across Central Pennsylvania.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {[['Instagram', BRAND.instagram], ['LinkedIn', BRAND.linkedin], ['Facebook', BRAND.facebook]].map(([l, h]) => (
                <a key={l} href={h} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.9rem' }}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: goldLight, marginBottom: '1rem' }}>Quick Links</h4>
            {navLinks.map(([h, l]) => (
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

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

        {/* Hero */}
        <section style={{ background: `linear-gradient(135deg, ${navy} 0%, #1a2942 100%)`, color: '#fff', padding: '4rem 0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '3rem', alignItems: 'center' }} className="about-grid">
            <div>
              <p style={{ color: goldLight, fontWeight: 600, letterSpacing: 2, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1rem' }}>About Jackson</p>
              <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                A Survivor Who Turned a Second Chance Into a<br /><span style={{ color: goldLight }}>Mission to Protect Others</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                In December 2010, Jackson Latimore suffered cardiac arrest at East Stroudsburg University. He was saved by an AED funded through the Gregory W. Moyer Defibrillator Fund. That moment changed everything.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                Today, as the founder of Latimore Life & Legacy LLC, Jackson channels that experience into helping Pennsylvania families protect what matters most — because he knows firsthand how quickly everything can change.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer" style={{ background: gold, color: navy, padding: '0.9rem 2rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none' }}>Book a Consultation</a>
                <a href={`tel:${BRAND.phoneRaw}`} style={{ background: 'transparent', color: '#fff', border: `2px solid ${gold}`, padding: '0.9rem 2rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none' }}>{BRAND.phone}</a>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img src="/jackson-library.jpg" alt="Jackson M. Latimore Sr." style={{ width: '100%', maxWidth: 420, borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.4)', objectFit: 'cover' }} />
            </div>
          </div>
          <style>{`@media(max-width:768px){.about-grid{grid-template-columns:1fr !important;}}`}</style>
        </section>

        {/* Story */}
        <section style={{ padding: '4rem 0', background: '#fff' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ color: navy, fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: '2rem', textAlign: 'center' }}>The Story Behind the Mission</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }} className="story-grid">
              <img src="/hospital-recovery.jpg" alt="Hospital recovery" style={{ width: '100%', borderRadius: 10, objectFit: 'cover' }} />
              <img src="/news-headline.jpg" alt="Pocono Record news headline" style={{ width: '100%', borderRadius: 10, objectFit: 'cover' }} />
            </div>
            <style>{`@media(max-width:600px){.story-grid{grid-template-columns:1fr !important;}}`}</style>
            <div style={{ background: `linear-gradient(135deg, ${navy}08, ${gold}15)`, border: `1px solid ${gold}40`, borderRadius: 12, padding: '2rem', marginBottom: '2rem' }}>
              <p style={{ color: navy, fontSize: '1.15rem', fontStyle: 'italic', lineHeight: 1.8, textAlign: 'center', fontWeight: 500 }}>
                &ldquo;Preparedness is everything. A piece of equipment funded by someone who cared enough to give saved my life. That is exactly what a well-structured insurance policy does for a family.&rdquo;
              </p>
              <p style={{ textAlign: 'center', color: gold, fontWeight: 700, marginTop: '1rem' }}>— Jackson M. Latimore Sr.</p>
            </div>
            <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Before founding Latimore Life & Legacy LLC, Jackson earned his Bachelor&apos;s in Political Science and Master of Public Administration from East Stroudsburg University — the same institution where his life was saved. He has since worked as a Social Security paralegal and home health aide, giving him direct insight into the financial vulnerabilities families face during health crises and life transitions.
            </p>
            <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Jackson is also a father, a youth sports coach, and an active member of the communities he serves across Schuylkill, Luzerne, and Northumberland Counties. His approach to financial protection is rooted in relationships — not transactions.
            </p>
          </div>
        </section>

        {/* Credentials */}
        <section style={{ background: '#F5F5F5', padding: '4rem 0' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ textAlign: 'center', color: navy, fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: '3rem' }}>Credentials & Background</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.5rem' }}>
              {[
                ['🎓', 'Education', 'Master of Public Administration & B.S. Political Science — East Stroudsburg University. Currently pursuing MBA.'],
                ['📋', 'PA Licensed', `Pennsylvania Department of Insurance License #${BRAND.paLicense}. NIPR #${BRAND.nipr}. Licensed life insurance producer.`],
                ['🏢', 'Affiliation', 'Independent contractor affiliated with Global Financial Impact. Access to multiple top-rated carriers — not tied to one company.'],
                ['🗺️', 'Service Area', 'Schuylkill, Luzerne, and Northumberland Counties, Pennsylvania. Local relationships, real community investment.'],
                ['💼', 'Background', 'Former Social Security paralegal and home health aide. Deep understanding of the financial challenges families face during illness and transitions.'],
                ['🏆', 'Specialties', 'Life insurance, living benefits, annuities, key person coverage, 401(k) rollovers, and retirement income planning.'],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ background: '#fff', borderRadius: 10, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: `3px solid ${gold}` }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
                  <h3 style={{ color: navy, fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h3>
                  <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section style={{ background: navy, padding: '4rem 0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: '1rem' }}>Why Families Choose to Work With Jackson</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '3rem' }}>
              As an independent consultant, Jackson is not locked into any single carrier or quota. Every recommendation is built around your situation — your income, your health, your goals, and your family.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {[
                ['🤝', 'Relationship First', 'You are not a policy number. Jackson takes time to understand your full picture before making any recommendation.'],
                ['📚', 'Education-Driven', 'You will understand exactly what you are buying, why it fits your situation, and what it will do for your family.'],
                ['🔓', 'Truly Independent', 'Multiple carriers. No quotas. No pressure. The right product for you — not the one that pays the highest commission.'],
                ['❤️', 'Community Rooted', 'Jackson lives and works in the communities he serves. This is not remote sales — it is a local relationship.'],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${gold}40`, borderRadius: 10, padding: '1.5rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
                  <h3 style={{ color: goldLight, fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', lineHeight: 1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
            <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer" style={{ background: gold, color: navy, padding: '1rem 2.5rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
              Schedule Your Free Consultation
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
