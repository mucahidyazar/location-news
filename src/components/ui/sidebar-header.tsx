import {ReactNode} from 'react'
import {cn} from '@/lib/utils'

interface SidebarHeaderProps {
  icon: ReactNode
  title: string
  subtitle?: string
  onClose: () => void
  className?: string
}

export function SidebarHeader({
  icon,
  title,
  subtitle,
  onClose,
  className,
}: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 border-b border-[var(--color-theme-border-primary)]',
        'bg-gradient-to-br from-[var(--color-theme-secondary-200)] via-[var(--color-theme-secondary-300)] to-[var(--color-theme-primary-200)]',
        className,
      )}
    >
      <div className="flex-1">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-[var(--color-theme-text-primary)]">
          {icon}
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm mt-1 text-[var(--color-theme-text-secondary)]">
            {subtitle}
          </p>
        )}
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded transition-colors hover:[background-color:var(--color-theme-surface-secondary)] text-[var(--color-theme-text-secondary)] min-w-8 min-h-8 flex items-center justify-center"
        aria-label="Close sidebar"
      >
        ✕
      </button>
    </div>
  )
}
