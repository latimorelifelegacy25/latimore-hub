import Link from 'next/link'

export default function BlogCTA() {
  return (
    <section className="sidebar-cta" aria-labelledby="sidebar-cta-title">
      <p id="sidebar-cta-title" className="sidebar-cta__title">
        Need help comparing options?
      </p>
      <p className="sidebar-cta__body">
        Start with a simple consultation and get clear next steps before making a policy decision.
      </p>
      <Link href="/book" className="sidebar-cta__btn">
        Book Consultation
      </Link>
    </section>
  )
}
