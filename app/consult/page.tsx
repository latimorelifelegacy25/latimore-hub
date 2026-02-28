/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { BRAND } from '@/lib/brand'
import { buildFilloutParams } from '@/lib/lead'

export default function ConsultPage() {
  // Dynamically build Fillout URL with hidden tracking params
  const [iframeSrc, setIframeSrc] = useState(BRAND.filloutUrl)

  useEffect(() => {
    const q = buildFilloutParams()
    setIframeSrc(q ? `${BRAND.filloutUrl}?${q}` : BRAND.filloutUrl)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0E1A2B', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <nav style={{ background: '#0E1A2B', borderBottom: '1px solid rgba(201,162,77,0.2)', padding: '1rem 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff', fontWeight: 700 }}>
            <img src="/logo.jpg" alt="Latimore Life & Legacy Logo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
            {BRAND.name}
          </Link>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Home</Link>
        </div>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 20px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ color: '#C9A24D', fontWeight: 600, letterSpacing: 2, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Get Started</p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,4vw,2.8rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>Request a Consultation</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Fill out the form below and Jackson will reach out within one business day to schedule your free consultation.
          </p>
        </div>
        <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <iframe
            src={iframeSrc}
            width="100%"
            height="700"
            frameBorder="0"
            style={{ display: 'block', border: 'none' }}
            title="Free Consultation Request"
          />
        </div>
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(201,162,77,0.1)', border: '1px solid rgba(201,162,77,0.3)', borderRadius: 10, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
            Prefer to call or text? <a href={`tel:${BRAND.phoneRaw}`} style={{ color: '#E5C882', fontWeight: 600, textDecoration: 'none' }}>{BRAND.phone}</a>
            &nbsp;·&nbsp;
            <a href={`mailto:${BRAND.email}`} style={{ color: '#E5C882', fontWeight: 600, textDecoration: 'none' }}>{BRAND.email}</a>
          </p>
        </div>
      </div>
    </div>
  )
}
