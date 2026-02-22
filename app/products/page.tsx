'use client'

const BRAND = {
  bookingUrl: 'https://latimorelifelegacy.fillout.com/latimorelifelegacy',
  ethosUrl: 'https://agents.ethoslife.com/invite/29ad1',
  phone: '(856) 895-1457',
  phoneRaw: '8568951457',
}

const products = [
  {
    category: 'Life Insurance',
    icon: '🛡️',
    items: [
      {
        name: 'Term Life Insurance',
        tagline: 'Maximum protection. Minimum cost.',
        description: 'Affordable coverage for 10–30 years — perfect for income replacement, mortgage protection, and young families building wealth. Carriers: Ethos Life, American General/Corebridge.',
        bestFor: 'Young families, mortgage holders, income earners',
        cta: 'Get a Quote',
        ctaUrl: BRAND.ethosUrl,
      },
      {
        name: 'Whole Life Insurance',
        tagline: 'Coverage that never expires.',
        description: 'Permanent protection with guaranteed cash value growth. Premiums lock in at the time of purchase — the younger and healthier you are, the lower they stay forever.',
        bestFor: 'Final expense planning, legacy building, lifelong protection',
        cta: 'Schedule Consultation',
        ctaUrl: BRAND.bookingUrl,
      },
      {
        name: 'Indexed Universal Life (IUL)',
        tagline: 'Growth potential with downside protection.',
        description: 'Flexible premiums, death benefit, and cash value tied to a market index — with a 0% floor so you never lose to a down market. One of the most powerful wealth-building tools available.',
        bestFor: 'High earners, business owners, tax-free retirement planning',
        cta: 'Schedule Consultation',
        ctaUrl: BRAND.bookingUrl,
      },
      {
        name: 'Key Person Insurance',
        tagline: 'Protect the people your business depends on.',
        description: 'If a key employee or owner dies unexpectedly, this policy gives your business the capital to survive, recruit, and recover without missing a beat.',
        bestFor: 'Small business owners, partnerships, employers',
        cta: 'Schedule Consultation',
        ctaUrl: BRAND.bookingUrl,
      },
    ]
  },
  {
    category: 'Annuities',
    icon: '📈',
    items: [
      {
        name: 'Fixed Indexed Annuity (FIA)',
        tagline: 'Growth without risk. Income you can\'t outlive.',
        description: 'Your premium earns interest linked to a market index (like the S&P 500) — but with a guaranteed floor so you never lose principal. Convert to a lifetime income stream at retirement. Carriers: North American Company, F&G, American Equity.',
        bestFor: 'Pre-retirees (50–65), conservative investors, pension replacement',
        cta: 'Schedule Consultation',
        ctaUrl: BRAND.bookingUrl,
      },
      {
        name: 'Multi-Year Guaranteed Annuity (MYGA)',
        tagline: 'CD alternative with better rates.',
        description: 'A fixed interest rate guaranteed for 3–10 years — often significantly higher than bank CDs, with tax-deferred growth and no market exposure.',
        bestFor: 'Retirees, conservative savers, CD rollovers',
        cta: 'Schedule Consultation',
        ctaUrl: BRAND.bookingUrl,
      },
    ]
  },
]

export default function ProductsPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0E1A2B 0%, #1a2942 100%)', color: '#fff', padding: '4rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
          <p style={{ color: '#E5C882', fontWeight: 600, letterSpacing: 2, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>What We Offer</p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1.5rem' }}>
            Products Built Around <span style={{ color: '#E5C882' }}>Your Life Stage</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
            As an independent advisor, I'm not tied to any single company. I shop the market to find the best product for your specific situation — not the one that pays me the most.
          </p>
        </div>
      </section>

      {/* Product Categories */}
      {products.map((cat) => (
        <section key={cat.category} style={{ padding: '5rem 0', background: cat.category === 'Annuities' ? '#F5F5F5' : '#fff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
              <span style={{ fontSize: '2.5rem' }}>{cat.icon}</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.3rem)', color: '#0E1A2B', margin: 0 }}>{cat.category}</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {cat.items.map((p) => (
                <div key={p.name} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 15px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ background: '#0E1A2B', padding: '1.5rem' }}>
                    <h3 style={{ color: '#E5C882', fontSize: '1.15rem', margin: '0 0 0.25rem' }}>{p.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>{p.tagline}</p>
                  </div>
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ color: '#444', lineHeight: 1.8, fontSize: '0.95rem', flex: 1 }}>{p.description}</p>
                    <div style={{ background: 'rgba(197,162,77,0.1)', borderRadius: 6, padding: '0.75rem 1rem', margin: '1rem 0' }}>
                      <p style={{ color: '#0E1A2B', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>✓ Best for: {p.bestFor}</p>
                    </div>
                    <a href={p.ctaUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', background: '#C9A24D', color: '#0E1A2B', textAlign: 'center', padding: '0.85rem', borderRadius: 6, fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
                      {p.cta} →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Carriers */}
      <section style={{ background: '#0E1A2B', padding: '4rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.5rem,4vw,2rem)', marginBottom: '0.75rem' }}>Carrier Relationships</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '2.5rem' }}>Access to multiple top-rated carriers means I find the best fit — not the easiest sale.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {['North American Company', 'F&G (Fidelity & Guaranty)', 'American Equity', 'Ethos Life / TruStage', 'American General / Corebridge Financial'].map(c => (
              <span key={c} style={{ background: 'rgba(197,162,77,0.15)', border: '1px solid #C9A24D', color: '#E5C882', padding: '0.6rem 1.2rem', borderRadius: 20, fontSize: '0.9rem', fontWeight: 600 }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Not Sure CTA */}
      <section style={{ background: 'linear-gradient(135deg, #C9A24D 0%, #E5C882 100%)', padding: '4rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.3rem)', color: '#0E1A2B', marginBottom: '1rem' }}>Not Sure Which Product Is Right for You?</h2>
          <p style={{ fontSize: '1.1rem', color: '#0E1A2B', marginBottom: '2rem' }}>That's exactly what the free consultation is for. We'll map out your situation and find the right fit together.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={BRAND.bookingUrl} target="_blank" rel="noopener noreferrer"
              style={{ background: '#0E1A2B', color: '#fff', padding: '1rem 2rem', borderRadius: 5, fontWeight: 700, textDecoration: 'none' }}>
              Book Free Consultation
            </a>
            <a href={`tel:${BRAND.phoneRaw}`}
              style={{ background: 'transparent', color: '#0E1A2B', border: '2px solid #0E1A2B', padding: '1rem 2rem', borderRadius: 5, fontWeight: 700, textDecoration: 'none' }}>
              Call {BRAND.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}