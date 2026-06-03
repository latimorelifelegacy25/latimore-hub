import Link from 'next/link'
import type { BlogCTAType } from '@/lib/blog'

interface PostCTABannerProps {
  type: BlogCTAType
}

const VARIANTS: Record<Exclude<BlogCTAType, 'none'>, { title: string; body: string; button: string; href: string }> = {
  consultation: {
    title: "Let's Talk — Free Consultation",
    body: 'No obligation. No pressure. A 20-minute conversation can give you more clarity than hours of research.',
    button: 'Book Your Free Consultation',
    href: '/book',
  },
  quote: {
    title: 'Get a Quick Term Life Quote',
    body: 'See your rates in minutes. No health exam required for many applicants.',
    button: 'Get My Quote Now',
    href: 'https://agents.ethoslife.com/invite/29ad1',
  },
  assessment: {
    title: 'Take Our 2-Minute Needs Assessment',
    body: 'Answer a few simple questions and get a personalized protection plan recommendation.',
    button: 'Start the Assessment',
    href: 'https://latimorelifelegacy.fillout.com/pahs',
  },
}

export default function PostCTABanner({ type }: PostCTABannerProps) {
  if (type === 'none') return null

  const variant = VARIANTS[type]
  const isExternal = variant.href.startsWith('http')

  return (
    <section className="post-cta-banner" aria-labelledby="post-cta-title">
      <p id="post-cta-title" className="post-cta-banner__title">
        {variant.title}
      </p>
      <p className="post-cta-banner__body">{variant.body}</p>
      {isExternal ? (
        <a href={variant.href} className="post-cta-banner__btn" target="_blank" rel="noopener noreferrer">
          {variant.button}
        </a>
      ) : (
        <Link href={variant.href} className="post-cta-banner__btn">
          {variant.button}
        </Link>
      )}
    </section>
  )
}
