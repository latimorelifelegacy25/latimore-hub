import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')
const WORDS_PER_MINUTE = 200

export const BLOG_CATEGORIES = [
  'Life Insurance',
  'Annuities & Retirement',
  'Estate & Legacy Planning',
  'Business Protection',
  'College Funding',
  'Debt & Mortgage',
  'Financial Literacy',
  'Community & Advocacy',
] as const

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]
export type BlogCTAType = 'consultation' | 'quote' | 'assessment' | 'none'

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  author: string
  category: BlogCategory
  tags: string[]
  image?: string
  imageAlt?: string
  featured: boolean
  cta: BlogCTAType
  seoTitle: string
  seoDescription: string
  readingTime: number
  excerpt: string
  publishedAt: string
}

type Frontmatter = Record<string, unknown>

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
}

function asCategory(value: unknown): BlogCategory {
  return BLOG_CATEGORIES.includes(value as BlogCategory) ? (value as BlogCategory) : 'Financial Literacy'
}

function asCTA(value: unknown): BlogCTAType {
  return value === 'consultation' || value === 'quote' || value === 'assessment' || value === 'none' ? value : 'consultation'
}

function plainText(content: string): string {
  return content
    .replaceAll('\n', ' ')
    .replaceAll('#', ' ')
    .replaceAll('*', ' ')
    .replaceAll('`', ' ')
    .replaceAll('<', ' ')
    .replaceAll('>', ' ')
    .split(' ')
    .filter(Boolean)
    .join(' ')
}

function createExcerpt(content: string, maxLength = 155): string {
  const plain = plainText(content)
  if (plain.length <= maxLength) return plain
  const truncated = plain.slice(0, maxLength).replace(/\s+\S*$/, '').trim()
  return `${truncated}...`
}

function calcReadingTime(content: string): number {
  const words = plainText(content).split(' ').filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

function safeDateValue(date: string): number {
  const timestamp = Date.parse(`${date}T00:00:00`)
  return Number.isFinite(timestamp) ? timestamp : 0
}

function normalizePost(slug: string, data: Frontmatter, content: string): BlogPost {
  const fallbackExcerpt = createExcerpt(content)
  const description = asString(data.description, asString(data.excerpt, fallbackExcerpt))
  const date = asString(data.date, asString(data.publishedAt))
  const title = asString(data.title, slug.replaceAll('-', ' '))

  return {
    slug,
    title,
    description,
    date,
    updated: asOptionalString(data.updated),
    author: asString(data.author, 'Jackson M. Latimore Sr.'),
    category: asCategory(data.category),
    tags: asStringArray(data.tags),
    image: asOptionalString(data.image),
    imageAlt: asOptionalString(data.imageAlt),
    featured: data.featured === true,
    cta: asCTA(data.cta),
    seoTitle: asString(data.seoTitle, `${title} | Latimore Life & Legacy`),
    seoDescription: asString(data.seoDescription, description || fallbackExcerpt),
    readingTime: calcReadingTime(content),
    excerpt: asString(data.excerpt, description || fallbackExcerpt),
    publishedAt: asString(data.publishedAt, date),
  }
}

function readAllFiles(): { slug: string; data: Frontmatter; content: string }[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx') && !entry.name.startsWith('_'))
    .map((entry) => {
      const slug = entry.name.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(CONTENT_DIR, entry.name), 'utf-8')
      const { data, content } = matter(raw)
      return { slug, data: data as Frontmatter, content }
    })
}

export function getAllPosts(): BlogPost[] {
  return readAllFiles()
    .map(({ slug, data, content }) => normalizePost(slug, data, content))
    .sort((a, b) => safeDateValue(b.date) - safeDateValue(a.date))
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.featured)
}

export function getFeaturedPost(): BlogPost | null {
  return getFeaturedPosts()[0] ?? getAllPosts()[0] ?? null
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category)
}

export function getPostsByTag(tag: string): BlogPost[] {
  const normalized = tag.trim().toLowerCase()
  return getAllPosts().filter((post) => post.tags.some((postTag) => postTag.trim().toLowerCase() === normalized))
}

export function getAllTags(): string[] {
  return Array.from(new Set(getAllPosts().flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b))
}

export function getPostBySlug(slug: string): { post: BlogPost; content: string } | null {
  if (slug.includes('/') || slug.includes('..')) return null

  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const post = normalizePost(slug, data as Frontmatter, content)

  return { post, content }
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx') && !entry.name.startsWith('_'))
    .map((entry) => entry.name.replace('.mdx', ''))
}
