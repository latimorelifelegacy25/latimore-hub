import Link from 'next/link'

interface BlogHeroProps {
  title: string
  description: string
  category?: string
}

function renderSplitTitle(title: string) {
  if (!title.includes('—')) return title
  const [first, ...rest] = title.split('—')
  return (
    <>
      {first.trim()} — <span>{rest.join('—').trim()}</span>
    </>
  )
}

export default function BlogHero({ title, description, category }: BlogHeroProps) {
  return (
    <section className="blog-hero" aria-labelledby="blog-hero-title">
      <div className="blog-hero__inner">
        <p className="blog-hero__breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> &rsaquo; <Link href="/education">Education</Link> &rsaquo;{' '}
          <Link href="/education/blog">Blog</Link>
          {category ? <> &rsaquo; <span>{category}</span></> : null}
        </p>
        <h1 id="blog-hero-title">{renderSplitTitle(title)}</h1>
        <p>{description}</p>
      </div>
    </section>
  )
}
