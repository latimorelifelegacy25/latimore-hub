import Link from 'next/link'
import type { ReactNode } from 'react'

type MDXComponents = Record<string, (props: any) => ReactNode>

function Callout({ type = 'tip', children }: { type?: 'tip' | 'warning' | 'story'; children?: ReactNode }) {
  const label = type === 'warning' ? 'Note' : type === 'story' ? 'Story' : 'Tip'
  return (
    <aside className={`callout callout--${type}`} aria-label={label}>
      <span className="callout__label">{label}</span>
      <div className="callout__body">{children}</div>
    </aside>
  )
}

function KeyTakeaway({ children }: { children?: ReactNode }) {
  return (
    <aside className="key-takeaway" aria-label="Key takeaway">
      <p className="key-takeaway__label">Key Takeaway</p>
      <div className="key-takeaway__body">{children}</div>
    </aside>
  )
}

function InlineCTA({ text, href, buttonText }: { text: string; href: string; buttonText: string }) {
  return (
    <aside className="inline-cta" aria-label="Article call to action">
      <p className="inline-cta__text">{text}</p>
      <Link href={href} className="inline-cta__btn">{buttonText}</Link>
    </aside>
  )
}

const customComponents = {
  Callout,
  KeyTakeaway,
  InlineCTA,
}

export function getMDXComponents(): MDXComponents {
  return customComponents
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components, ...customComponents }
}
