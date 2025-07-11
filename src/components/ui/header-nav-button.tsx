import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderNavButtonProps {
  icon: LucideIcon
  label: string
  isActive: boolean
  onClick: () => void
  className?: string
}

export function HeaderNavButton({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick,
  className
}: HeaderNavButtonProps) {
  return (
    <li className={cn("relative flex", className)}>
      <a
        href="#"
        onClick={e => {
          e.preventDefault()
          onClick()
        }}
        className={cn(
          "flex flex-col items-center py-2 px-0 md:p-3 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px]",
          "hover:[color:var(--color-theme-primary-500)] hover:[background-color:var(--color-theme-primary-50)]",
          isActive ? [
            "[color:var(--color-theme-primary-600)]",
            "[background-color:var(--color-theme-primary-50)]",
            "[box-shadow:0_1px_2px_0_var(--color-theme-bg-overlay)]"
          ] : [
            "[color:var(--color-theme-text-secondary)]"
          ]
        )}
        title={label}
      >
        <Icon
          className={cn(
            "w-5 h-5 mb-1 transition-transform duration-300",
            isActive && "scale-110 rotate-12"
          )}
        />
        <span>{label}</span>
      </a>
      
      {isActive && (
        <div
          className="absolute -bottom-1 left-0 right-0 h-0.5 shadow-lg [background-color:var(--color-theme-primary-100)]"
        />
      )}
    </li>
  )
}