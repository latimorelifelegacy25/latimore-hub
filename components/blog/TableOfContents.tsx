interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const visibleHeadings = headings.filter((heading) => heading.id && heading.text && heading.level >= 2 && heading.level <= 3)

  if (visibleHeadings.length === 0) return null

  return (
    <nav className="blog-sidebar__card" aria-labelledby="toc-title">
      <h3 id="toc-title">In This Article</h3>
      <ul className="toc">
        {visibleHeadings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'toc--h3' : undefined}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
