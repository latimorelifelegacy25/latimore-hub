import Link from 'next/link'

const FILLOUT_URL = 'https://latimorelifelegacy.fillout.com/latimorelifelegacy'

export default function BookPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0E1A2B', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <nav style={{ background: '#0E1A2B', borderBottom: '1px solid rgba(201,162,77,0.2)', padding: '1rem 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff', fontWeight: 700 }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
            Latimore Life & Legacy
          </Link>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Home</Link>
        </div>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 20px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ color: '#C9A24D', fontWeight: 600, letterSpacing: 2, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Free Consultation</p>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,4vw,2.8rem)', marginBottom: '0.75rem', lineHeight: 1.2 }}>Secure Your Legacy</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Fill out the form below to book your free 30-minute consultation. No obligation — just a real conversation about protecting your family.
          </p>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <iframe src={FILLOUT_URL} style={{ width: '100%', height: 700, border: 'none', display: 'block' }} title="Book a Consultation" />
        </div>
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(201,162,77,0.1)', border: '1px solid rgba(201,162,77,0.3)', borderRadius: 10, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
            Prefer to call or text? <a href="tel:8568951457" style={{ color: '#E5C882', fontWeight: 600, textDecoration: 'none' }}>(856) 895-1457</a>
            &nbsp;·&nbsp;
            <a href="mailto:jackson1989@latimorelegacy.com" style={{ color: '#E5C882', fontWeight: 600, textDecoration: 'none' }}>jackson1989@latimorelegacy.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
// force deploy Fri Feb 27 18:45:20 UTC 2026
