import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blog'

function formatDate(dateStr: string): string {
  const timestamp = Date.parse(`${dateStr}T00:00:00`)
  if (!Number.isFinite(timestamp)) return dateStr

  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function createExcerpt(description: string, maxLength = 120): string {
  if (description.length <= maxLength) return description
  return `${description.slice(0, maxLength).trim()}...`
}

export function NewBlogCard({ post }: { post: BlogPost }) {
  const excerpt = createExcerpt(post.description)

  return (
    <Link href={`/education/blog/${post.slug}`} className="blog-card" aria-label={`Read ${post.title}`}>
      {post.image ? (
        <Image
          src={post.image}
          alt={post.imageAlt ?? post.title}
          width={640}
          height={360}
          className="blog-card__image"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      ) : (
        <div className="blog-card__image-placeholder" aria-hidden="true" />
      )}

      <div className="blog-card__body">
        <span className="blog-card__category">{post.category}</span>
        <h2 className="blog-card__title">{post.title}</h2>
        <p className="blog-card__excerpt">{excerpt}</p>
        <div className="blog-card__meta" aria-label="Article details">
          <span>{post.readingTime} min read</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </div>
    </Link>
  )
}

export default NewBlogCard
