'use client'

import { useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { BRAND } from '@/lib/brand'

const navy = '#0E1A2B'
const gold = '#C9A24D'
const goldLight = '#E5C882'

const navLinks: [string, string][] = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/products', 'Products'],
  ['/services', 'Services'],
  ['/education', 'Education'],
  ['/join', 'Join Our Team'],
  ['/contact', 'Contact'],
]

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
            <Link key={href} href={href} style={{ color: href === '/join' ? goldLight : '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: href === '/join' ? 600 : 400 }}>{label}</Link>
          ))}
          <a href={BRAND.bookingUrl} style={{ background: gold, color: navy, padding: '0.5rem 1rem', borderRadius: 5, fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}>Book Consultation</a>
          <a href={BRAND.ethosUrl} target="_blank" rel="noopener noreferrer" style={{ background: goldLight, color: navy, padding: '0.5rem 1rem', borderRadius: 5, fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem' }}>Get Quote</a>
        </div>
        <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }} className="mobile-btn">{open ? '✕' : '☰'}</button>
      </div>
      {open && (
        <div style={{ background: navy, padding: '1rem 20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {navLinks.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{ color: href === '/join' ? goldLight : '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>{label}</Link>
          ))}
          <a href={BRAND.bookingUrl} style={{ background: gold, color: navy, padding: '0.75rem', borderRadius: 5, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>Book Consultation</a>
          <a href={BRAND.ethosUrl} target="_blank" rel="noopener noreferrer" style={{ background: goldLight, color: navy, padding: '0.75rem', borderRadius: 5, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>Get Quote</a>
        </div>
      )}
      <style>{`@media(max-width:1100px){.desktop-nav{display:none !important;}.mobile-btn{display:block !important;}}`}</style>
    </nav>
  )
}

function Footer() {
  return (
    <footer style={{ background: navy, color: '#fff', padding: '3rem 0 1rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ color: goldLight, marginBottom: '1rem' }}>{BRAND.fullName} LLC</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)' }}>Independent Insurance Advisor<br />{BRAND.affiliation}</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>PA License #{BRAND.paLicense} · NIPR #{BRAND.nipr}</p>
          </div>
          <div>
            <h4 style={{ color: goldLight, marginBottom: '1rem' }}>Quick Links</h4>
            {navLinks.map(([href, label]) => (
              <div key={href} style={{ marginBottom: '0.4rem' }}>
                <Link href={href} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.85rem' }}>{label}</Link>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ color: goldLight, marginBottom: '1rem' }}>Contact</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}>
              <a href={`tel:+1${BRAND.phoneRaw}`} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{BRAND.phone}</a><br />
              <a href={`mailto:${BRAND.email}`} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{BRAND.email}</a><br />
              1544 Route 61 Hwy S, Ste 6104<br />Pottsville, PA 17901
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a href={BRAND.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: goldLight, textDecoration: 'none', fontSize: '0.85rem' }}>LinkedIn</a>
              <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" style={{ color: goldLight, textDecoration: 'none', fontSize: '0.85rem' }}>Instagram</a>
              <a href={BRAND.facebook} target="_blank" rel="noopener noreferrer" style={{ color: goldLight, textDecoration: 'none', fontSize: '0.85rem' }}>Facebook</a>
            </div>
          </div>
        </div>
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} {BRAND.fullName} LLC · All rights reserved</p>
          <p style={{ margin: '0.5rem 0 0' }}>{BRAND.tagline} · {BRAND.hashtag}</p>
          <p style={{ margin: '0.75rem 0 0', lineHeight: 1.6, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
            Opportunity details, product availability, and compensation structure may vary by state, carrier appointment, and licensing status. 
            Independent contractor affiliated with {BRAND.affiliation.replace('In Affiliation with ', '')}. Products offered through appointed carriers. 
            For educational purposes only; not tax or legal advice.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function JoinPage() {
  return (
    <>
      <Nav />

      {/* Hero Section */}
      <section style={{ background: `linear-gradient(135deg, ${navy} 0%, #1a2942 100%)`, color: '#fff', padding: '5rem 0 4rem' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr .85fr', gap: 28, alignItems: 'stretch' }} className="hero-grid">
            <div>
              <div style={{ color: goldLight, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.82rem', marginBottom: 10 }}>Join the Mission</div>
              <h1 style={{ fontSize: 'clamp(2rem,4vw,3.6rem)', lineHeight: 1.06, margin: '0 0 16px' }}>
                Build a meaningful career helping families protect what matters most.
              </h1>
              <p style={{ fontSize: '1.08rem', color: 'rgba(255,255,255,0.9)', maxWidth: '66ch', margin: '0 0 24px', lineHeight: 1.7 }}>
                {BRAND.name} is built around an education-first approach to life insurance and financial protection. We are looking for coachable, service-minded people who want to grow as independent professionals while making a real impact in their communities.
              </p>

              <div style={{ background: 'rgba(229,200,130,0.15)', borderLeft: `4px solid ${goldLight}`, padding: '16px 18px', borderRadius: 14, margin: '20px 0', fontStyle: 'italic' }}>
                "Helping people become legacy ready isn't just a business goal — it's a responsibility."
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <a href="#apply" style={{ display: 'inline-block', background: gold, color: navy, padding: '12px 24px', borderRadius: 999, fontWeight: 700, textDecoration: 'none', transition: 'transform .18s ease' }} className="btn-hover">Apply Now</a>
                <Link href="/about" style={{ display: 'inline-block', background: '#fff', color: navy, padding: '12px 24px', borderRadius: 999, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }} className="btn-hover">Learn About Jackson</Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="stats-grid">
                {[
                  { label: 'Mission-Driven', desc: 'Protect families through education, preparation, and service.' },
                  { label: 'Flexible Path', desc: 'Start part-time or full-time based on your goals and licensing progress.' },
                  { label: 'Supported Growth', desc: 'Training, mentorship, and systems to help you build the right foundation.' },
                ].map(({ label, desc }) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: 16 }}>
                    <strong style={{ display: 'block', color: goldLight, fontSize: '1.05rem', marginBottom: 4 }}>{label}</strong>
                    <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)' }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <aside style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 18, boxShadow: '0 14px 40px rgba(15,53,85,.10)', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#333' }}>
              <div>
                <h2 style={{ margin: '0 0 10px', color: navy, fontSize: '1.4rem' }}>Why people join</h2>
                <p style={{ color: '#475467', margin: '0 0 1rem' }}>This opportunity is a fit for people who care about service, personal growth, and long-term relationships.</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0' }}>
                  {[
                    'Serve families with protection-first conversations',
                    'Develop sales, communication, and planning skills',
                    'Work with mentorship and a structured onboarding path',
                    'Build a business grounded in trust and follow-through',
                  ].map(item => (
                    <li key={item} style={{ margin: '10px 0', paddingLeft: 28, position: 'relative', color: '#333' }}>
                      <span style={{ position: 'absolute', left: 0, top: 0, color: '#0b7a55', fontWeight: 700 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: 18 }}>
                {['Independent Opportunity', 'Licensing Required', 'Training Available'].map(tag => (
                  <span key={tag} style={{ display: 'inline-block', padding: '6px 10px', borderRadius: 999, background: '#eff7ff', color: navy, fontSize: '.86rem', fontWeight: 700, margin: '0 8px 8px 0', border: '1px solid #dbeaf8' }}>{tag}</span>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section style={{ padding: '4rem 0', background: '#f9fafb' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem,2.4vw,2.2rem)', color: navy, margin: '0 0 12px', textAlign: 'center' }}>Who this is for</h2>
          <p style={{ color: '#667085', maxWidth: '72ch', margin: '0 auto 2rem', textAlign: 'center', fontSize: '1.05rem' }}>
            You do not need decades of industry experience to get started, but you do need integrity, discipline, and the willingness to learn. The right candidate is motivated by impact as much as income.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="grid-3">
            {[
              { title: 'Service-minded people', desc: 'You care about helping others make informed decisions and you are comfortable building trust over time.' },
              { title: 'Coachability', desc: 'You are open to feedback, willing to study, and ready to improve your communication and professional habits.' },
              { title: 'Self-starters', desc: 'You can manage your time, follow a process, and stay consistent even when no one is watching.' },
            ].map(({ title, desc }) => (
              <article key={title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, boxShadow: '0 14px 40px rgba(15,53,85,.10)', padding: 22 }}>
                <h3 style={{ margin: '0 0 10px', color: navy, fontSize: '1.18rem' }}>{title}</h3>
                <p style={{ margin: 0, color: '#475467' }}>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Help Clients Do */}
      <section style={{ padding: '4rem 0', background: '#fff' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, alignItems: 'start' }} className="split-grid">
            <div style={{ background: `linear-gradient(135deg, ${navy}, #1f6fa9)`, color: '#fff', padding: 28, borderRadius: 18, boxShadow: '0 14px 40px rgba(15,53,85,.10)' }}>
              <h2 style={{ marginTop: 0, color: '#fff', fontSize: '1.6rem' }}>What you will help clients do</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0' }}>
                {[
                  'Protect income and loved ones with life insurance solutions',
                  'Address final expense, mortgage protection, and living benefit needs',
                  'Navigate retirement-focused conversations and safe-money options',
                  'Think through legacy and continuity planning with the right licensed support',
                  'Get education-first guidance instead of pressure-first sales tactics',
                ].map(item => (
                  <li key={item} style={{ margin: '10px 0', paddingLeft: 28, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, top: 0, color: '#0b7a55', fontWeight: 700 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, boxShadow: '0 14px 40px rgba(15,53,85,.10)', padding: 22 }}>
              <h3 style={{ margin: '0 0 1rem', color: navy, fontSize: '1.4rem' }}>What we provide</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0' }}>
                {[
                  'Onboarding guidance and field support',
                  'Access to training resources and scripts',
                  'Mentorship from experienced leaders',
                  'Tools to help with scheduling, follow-up, and application flow',
                  'A business model centered on relationships, not hype',
                ].map(item => (
                  <li key={item} style={{ margin: '10px 0', paddingLeft: 28, position: 'relative', color: '#333' }}>
                    <span style={{ position: 'absolute', left: 0, top: 0, color: '#0b7a55', fontWeight: 700 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity Snapshot */}
      <section style={{ padding: '4rem 0', background: '#f9fafb' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem,2.4vw,2.2rem)', color: navy, margin: '0 0 12px', textAlign: 'center' }}>Opportunity snapshot</h2>
          <p style={{ color: '#667085', maxWidth: '72ch', margin: '0 auto 2rem', textAlign: 'center' }}>A clear overview of what we look for and what candidates can expect.</p>
          
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 18, background: '#fff', boxShadow: '0 14px 40px rgba(15,53,85,.10)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px 18px', textAlign: 'left', background: navy, color: '#fff', fontSize: '.95rem' }}>What we look for</th>
                  <th style={{ padding: '16px 18px', textAlign: 'left', background: navy, color: '#fff', fontSize: '.95rem' }}>What candidates can expect</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Strong communication skills and professionalism', 'Guided onboarding, training resources, and mentorship'],
                  ['Commitment to ethical, education-first client conversations', 'Flexible work structure based on availability and licensing status'],
                  ['Willingness to obtain required life and health licensing', 'A pathway to grow as an independent producer'],
                  ['Consistency, follow-up, and personal accountability', 'Access to products through appointed carrier relationships, subject to approval'],
                ].map(([look, expect], i) => (
                  <tr key={i}>
                    <td style={{ padding: '16px 18px', borderBottom: i === 3 ? 'none' : '1px solid #e8eef5', verticalAlign: 'top', color: '#333' }}>{look}</td>
                    <td style={{ padding: '16px 18px', borderBottom: i === 3 ? 'none' : '1px solid #e8eef5', verticalAlign: 'top', color: '#333' }}>{expect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Role Focus & Requirements */}
      <section style={{ padding: '4rem 0', background: '#fff' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="grid-2">
            <article style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, boxShadow: '0 14px 40px rgba(15,53,85,.10)', padding: 22 }}>
              <h2 style={{ marginTop: 0, color: navy, fontSize: '1.4rem' }}>Role focus</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0' }}>
                {[
                  'Schedule and conduct client discovery conversations',
                  'Identify protection needs and match clients to appropriate next steps',
                  'Follow compliance, licensing, and carrier appointment requirements',
                  'Maintain relationships through service and annual reviews',
                ].map(item => (
                  <li key={item} style={{ margin: '10px 0', paddingLeft: 28, position: 'relative', color: '#333' }}>
                    <span style={{ position: 'absolute', left: 0, top: 0, color: '#0b7a55', fontWeight: 700 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, boxShadow: '0 14px 40px rgba(15,53,85,.10)', padding: 22 }}>
              <h2 style={{ marginTop: 0, color: navy, fontSize: '1.4rem' }}>Basic requirements</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0' }}>
                {[
                  'High school diploma or equivalent',
                  'Willingness to complete state licensing as required',
                  'Reliable internet, phone access, and professional follow-up habits',
                  'Commitment to serving people with honesty and empathy',
                ].map(item => (
                  <li key={item} style={{ margin: '10px 0', paddingLeft: 28, position: 'relative', color: '#333' }}>
                    <span style={{ position: 'absolute', left: 0, top: 0, color: '#0b7a55', fontWeight: 700 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Apply Section */}
      <section id="apply" style={{ padding: '4rem 0', background: '#f9fafb' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem,2.4vw,2.2rem)', color: navy, margin: '0 0 12px', textAlign: 'center' }}>Apply now</h2>
          <p style={{ color: '#667085', maxWidth: '72ch', margin: '0 auto 2rem', textAlign: 'center' }}>Interested in exploring the fit? Complete the application below and we will follow up with next steps.</p>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 18, boxShadow: '0 14px 40px rgba(15,53,85,.10)' }}>
            <div style={{ width: '100%', height: 560 }} data-fillout-id="tMz7ZcqpaZus" data-fillout-embed-type="standard" data-fillout-inherit-parameters data-fillout-dynamic-resize aria-label="Application form" />
            <Script src="https://server.fillout.com/embed/v1/" strategy="lazyOnload" />
            <p style={{ fontSize: '.95rem', color: '#667085', marginTop: 12 }}>
              If the embedded form does not load on your website platform, replace this section with a button that opens your application form in a new tab.
            </p>
            <p style={{ margin: '14px 0 0' }}>
              <a href={BRAND.ethosUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#fff', color: navy, padding: '12px 18px', borderRadius: 999, fontWeight: 600, textDecoration: 'none', border: '1px solid #e2e8f0' }} className="btn-hover">
                Ethos Application Link
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '4rem 0', background: '#fff' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="contact-grid">
            <article style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, boxShadow: '0 14px 40px rgba(15,53,85,.10)', padding: 22 }}>
              <h2 style={{ marginTop: 0, color: navy, fontSize: '1.4rem' }}>Contact</h2>
              <ul style={{ paddingLeft: 18, margin: 0, color: '#333' }}>
                <li><strong>{BRAND.advisor}</strong></li>
                <li>1544 Route 61 Hwy S, Ste 6104, Pottsville, PA 17901</li>
                <li><a href={`mailto:${BRAND.email}`} style={{ color: navy }}>{BRAND.email}</a></li>
                <li><a href={`tel:+1${BRAND.phoneRaw}`} style={{ color: navy }}>{BRAND.phone}</a></li>
                <li><a href={BRAND.baseUrl} target="_blank" rel="noopener noreferrer" style={{ color: navy }}>{BRAND.baseUrl.replace('https://', '')}</a></li>
              </ul>
            </article>

            <article style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, boxShadow: '0 14px 40px rgba(15,53,85,.10)', padding: 22 }}>
              <h2 style={{ marginTop: 0, color: navy, fontSize: '1.4rem' }}>Connect online</h2>
              <p style={{ marginTop: 0, color: '#475467' }}>Use the same channels already active on the main site.</p>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                <li><a href={BRAND.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: navy }}>LinkedIn</a></li>
                <li><a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" style={{ color: navy }}>Instagram</a></li>
                <li><a href={BRAND.facebook} target="_blank" rel="noopener noreferrer" style={{ color: navy }}>Facebook</a></li>
                <li><a href={BRAND.cardUrl} target="_blank" rel="noopener noreferrer" style={{ color: navy }}>Digital Business Card</a></li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .btn-hover:hover {
          transform: translateY(-1px);
          transition: transform .18s ease;
        }
        @media (max-width: 960px) {
          .hero-grid, .grid-3, .grid-2, .split-grid, .contact-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
