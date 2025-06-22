'use client'

import Script from 'next/script'

interface TwitterEmbedProps {
  url: string
  className?: string
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void
      }
    }
  }
}

export default function TwitterEmbed({url, className = ''}: TwitterEmbedProps) {
  // Extract tweet ID from URL
  const getTweetId = (tweetUrl: string) => {
    const match = tweetUrl.match(/status\/(\d+)/)
    return match ? match[1] : null
  }

  const tweetId = getTweetId(url)

  if (!tweetId) {
    return (
      <div className={`p-4 border rounded-lg bg-gray-50 ${className}`}>
        <p className="text-gray-600 text-sm">Invalid Twitter URL</p>
      </div>
    )
  }

  const tweetUrl = url.includes('x.com')
    ? url.replace('x.com', 'twitter.com')
    : url

  return (
    <>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (window.twttr?.widgets) {
            window.twttr.widgets.load()
          }
        }}
      />
      <div className={`twitter-embed-container ${className}`}>
        <blockquote className="twitter-tweet" data-theme="light">
          <a href={tweetUrl}></a>
        </blockquote>
      </div>
    </>
  )
}
