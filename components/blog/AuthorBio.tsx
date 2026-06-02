import Image from 'next/image'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'

interface AuthorBioProps {
  author: string
}

const HEADSHOT_PATH = '/images/blog/jackson-headshot.jpg'

function hasHeadshot(): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', HEADSHOT_PATH))
  } catch {
    return false
  }
}

function getInitials(name: string): string {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return initials || 'JL'
}

export default function AuthorBio({ author }: AuthorBioProps) {
  const showHeadshot = hasHeadshot()

  return (
    <section className="author-bio" aria-label="Article author">
      {showHeadshot ? (
        <Image
          src={HEADSHOT_PATH}
          alt={author}
          width={72}
          height={72}
          className="author-bio__avatar"
        />
      ) : (
        <div className="author-bio__initials" aria-label={author} role="img">
          {getInitials(author)}
        </div>
      )}

      <div className="author-bio__info">
        <p className="author-bio__name">{author}</p>
        <p className="author-bio__title">Founder and CEO, Latimore Life &amp; Legacy LLC</p>
        <p className="author-bio__credentials">PA Licensed Life, Health, Accident, and Annuities Professional</p>
        <Link href="/about" className="author-bio__link">
          About Jackson
        </Link>
      </div>
    </section>
  )
}
