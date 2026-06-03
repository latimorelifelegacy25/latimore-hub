import Link from 'next/link'
import BlogCTA from './BlogCTA'
import { getAllPosts } from '@/lib/blog'

interface BlogSidebarProps {
  categories: string[]
  currentCategory?: string
  currentTag?: string
}

export default function BlogSidebar({ categories, currentCategory, currentTag }: BlogSidebarProps) {
  const allPosts = getAllPosts()
  const counts = allPosts.reduce<Record<string, number>>((acc, post) => {
    acc[post.category] = (acc[post.category] ?? 0) + 1
    return acc
  }, {})

  return (
    <aside className="blog-sidebar" aria-label="Blog sidebar">
      <section className="blog-sidebar__card" aria-labelledby="browse-topics-title">
        <h3 id="browse-topics-title">Browse Topics</h3>
        <ul className="sidebar-category-list">
          <li>
            <Link href="/education/blog" className={!currentCategory && !currentTag ? 'active' : ''}>
              <span>All Articles</span>
              <span className="sidebar-category-list__count">{allPosts.length}</span>
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category}>
              <Link
                href={`/education/blog?category=${encodeURIComponent(category)}`}
                className={currentCategory === category ? 'active' : ''}
              >
                <span>{category}</span>
                <span className="sidebar-category-list__count">{counts[category] ?? 0}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <BlogCTA />

      <section className="blog-sidebar__card" aria-labelledby="stay-informed-title">
        <h3 id="stay-informed-title">Stay Informed</h3>
        <p style={{ fontSize: '0.9rem', color: '#5D6470', marginBottom: '1rem', lineHeight: 1.6 }}>
          Need help turning one of these topics into a decision? Start with a simple consultation.
        </p>
        <Link href="/contact" className="sidebar-cta__btn">
          Ask a Question
        </Link>
      </section>
    </aside>
  )
}
