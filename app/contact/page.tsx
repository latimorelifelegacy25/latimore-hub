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

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

        {/* Header */}
        <section style={{ background: `linear-gradient(135deg, ${navy} 0%, #1a2942 100%)`, color: '#fff', padding: '4rem 0', textAlign: 'center' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px' }}>
            <p style={{ color: goldLight, fontWeight: 600, letterSpacing: 2, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Get in Touch</p>
            <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              Ready to Protect<br /><span style={{ color: goldLight }}>What Matters Most?</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.8 }}>
              Reach out by phone, email, or book directly online. No pressure, no obligation — just a real conversation about your family&apos;s financial protection.
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section style={{ padding: '4rem 0', background: '#F5F5F5' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2rem', marginBottom: '3rem' }}>

              {/* Book */}
              <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderTop: `4px solid ${gold}`, textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📅</div>
                <h2 style={{ color: navy, fontSize: '1.3rem', marginBottom: '0.75rem' }}>Book a Consultation</h2>
                <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Schedule a free, no-obligation consultation at a time that works for you. Jackson will review your situation and walk you through your options.
                </p>
                <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: gold, color: navy, padding: '0.9rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
                  Schedule Now →
                </a>
              </div>

              {/* Phone */}
              <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderTop: `4px solid ${gold}`, textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📞</div>
                <h2 style={{ color: navy, fontSize: '1.3rem', marginBottom: '0.75rem' }}>Call or Text</h2>
                <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Prefer to call? Reach Jackson directly. Calls and texts welcome during business hours across Schuylkill, Luzerne, and Northumberland Counties.
                </p>
                <a href={`tel:${BRAND.phoneRaw}`}
                  style={{ display: 'block', background: gold, color: navy, padding: '0.9rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
                  {BRAND.phone}
                </a>
              </div>

              {/* Email */}
              <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderTop: `4px solid ${gold}`, textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✉️</div>
                <h2 style={{ color: navy, fontSize: '1.3rem', marginBottom: '0.75rem' }}>Send an Email</h2>
                <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Have a question or want to share some background before your consultation? Send a message and expect a response within one business day.
                </p>
                <a href={`mailto:${BRAND.email}`}
                  style={{ display: 'block', background: gold, color: navy, padding: '0.9rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', wordBreak: 'break-all' }}>
                  {BRAND.email}
                </a>
              </div>

              {/* Get Quote */}
              <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderTop: `4px solid ${gold}`, textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
                <h2 style={{ color: navy, fontSize: '1.3rem', marginBottom: '0.75rem' }}>Get an Instant Quote</h2>
                <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Want a quick term life insurance quote online? Apply in minutes. No medical exam required for many applicants. Fast approval decisions.
                </p>
                <a href={BRAND.ethosUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: gold, color: navy, padding: '0.9rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
                  Get Quote Now →
                </a>
              </div>

              {/* Facebook */}
              <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderTop: `4px solid ${gold}`, textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📘</div>
                <h2 style={{ color: navy, fontSize: '1.3rem', marginBottom: '0.75rem' }}>Follow on Facebook</h2>
                <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Follow the Latimore Life & Legacy Facebook page for educational content, community updates, and financial protection tips.
                </p>
                <a href={BRAND.facebook} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: gold, color: navy, padding: '0.9rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>
                  Visit Facebook Page →
                </a>
              </div>

              {/* QR */}
              <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderTop: `4px solid ${gold}`, textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📱</div>
                <h2 style={{ color: navy, fontSize: '1.3rem', marginBottom: '0.75rem' }}>Scan to Apply</h2>
                <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Scan the QR code to go directly to the instant life insurance application. Takes minutes on your phone.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img src="/ethos-qr.png" alt="Scan to apply for life insurance" style={{ width: 120, height: 120, borderRadius: 8 }} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Social / Location */}
        <section style={{ background: navy, padding: '4rem 0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: '1rem' }}>Stay Connected</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '2rem' }}>
              Follow along on social media for educational content on life insurance, annuities, and financial protection for Pennsylvania families.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
              {[
                ['📷 Instagram', BRAND.instagram],
                ['💼 LinkedIn', BRAND.linkedin],
                ['📘 Facebook', BRAND.facebook],
              ].map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${gold}50`, color: goldLight, padding: '0.75rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                  {label}
                </a>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${gold}30`, borderRadius: 10, padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
              <p style={{ color: goldLight, fontWeight: 700, marginBottom: '0.5rem' }}>📍 Service Area</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                Schuylkill County · Luzerne County · Northumberland County<br />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Central & Northeastern Pennsylvania</span>
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
