'use client'

import { useMemo, useState } from 'react'

interface ShareButtonsProps {
  title: string
  url: string
}

function getShareUrl(url: string): string {
  if (url.startsWith('http')) return url
  if (typeof window === 'undefined') return url
  return new URL(url, window.location.origin).toString()
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = useMemo(() => getShareUrl(url), [url])
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="share-buttons" aria-label="Share this article">
      <span className="share-buttons__label">Share:</span>
      <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="share-buttons__btn">
        X
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="share-buttons__btn">
        Facebook
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="share-buttons__btn">
        LinkedIn
      </a>
      <button type="button" onClick={copyLink} className="share-buttons__btn">
        {copied ? 'Copied' : 'Copy Link'}
      </button>
    </div>
  )
}
