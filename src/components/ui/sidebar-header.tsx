import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SidebarHeaderProps {
  icon: ReactNode
  title: string
  subtitle?: string
  onClose: () => void
  showCount?: { 
    label: string
    count: number 
  }
  className?: string
}

export function SidebarHeader({ 
  icon, 
  title, 
  subtitle, 
  onClose, 
  showCount,
  className 
}: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border-b border-[var(--color-theme-border-primary)]",
        "bg-gradient-to-br from-[var(--color-theme-secondary-200)] via-[var(--color-theme-secondary-300)] to-[var(--color-theme-primary-200)]",
        className
      )}
    >
      <div className="flex-1">
        <h2
          className="text-lg font-semibold flex items-center gap-2 text-[var(--color-theme-text-primary)]"
        >
          {icon}
          {title}
        </h2>
        
        {subtitle && (
          <p
            className="text-sm mt-1 text-[var(--color-theme-text-secondary)]"
          >
            {subtitle}
          </p>
        )}
        
        {showCount && (
          <div className="flex items-center gap-2 mt-2">
            <span
              className="text-xs text-[var(--color-theme-text-secondary)]"
            >
              {showCount.label}:
            </span>
            <span
              className="text-sm font-medium px-2 py-1 rounded-full bg-[var(--color-theme-primary-50)] text-[var(--color-theme-primary-700)]"
            >
              {showCount.count}
            </span>
          </div>
        )}
      </div>
      
      <button
        onClick={onClose}
        className="p-1 rounded transition-colors hover:[background-color:var(--color-theme-surface-secondary)] text-[var(--color-theme-text-secondary)]"
        
        aria-label="Close sidebar"
      >
        ✕
      </button>
    </div>
  )
}