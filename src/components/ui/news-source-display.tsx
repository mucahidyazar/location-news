import {cn} from '@/lib/utils'
import {SourceLogo} from '@/lib/news-sources'

interface NewsSourceDisplayProps {
  source:
    | {
        id?: string
        name: string
        logo_url?: string | null
      }
    | string
    | null
    | undefined
  externalUrl?: string | null
  variant?: 'default' | 'compact' | 'minimal'
  className?: string
  showTruncate?: boolean
}

export function NewsSourceDisplay({
  source,
  externalUrl,
  className,
  showTruncate = false,
}: NewsSourceDisplayProps) {
  // Extract source name - handle both string and object types
  const sourceName = typeof source === 'string' ? source : source?.name || ''

  if (!sourceName) return null

  const baseClasses = cn(
    'flex items-center gap-1 text-xs',
    '[color:var(--color-theme-text-tertiary)]',
    showTruncate && 'truncate',
    className,
  )

  const interactiveClasses = cn(
    baseClasses,
    'transition-colors group hover:underline',
    'hover:[color:var(--color-theme-primary-600)]',
  )

  const content = (
    <>
      <SourceLogo source={source} />
      <span>{sourceName}</span>
    </>
  )

  // Render with external link if available
  if (externalUrl) {
    return (
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={interactiveClasses}
      >
        {content}
      </a>
    )
  }

  // Render as non-interactive div
  return <div className={baseClasses}>{content}</div>
}
