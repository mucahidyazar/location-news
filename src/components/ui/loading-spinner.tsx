import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
  variant?: 'default' | 'button' | 'page' | 'inline'
  showText?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6', 
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
}

const borderClasses = {
  sm: 'border-2',
  md: 'border-2',
  lg: 'border-2', 
  xl: 'border-2'
}

export function LoadingSpinner({ 
  size = 'md',
  text,
  className,
  variant = 'default',
  showText = true
}: LoadingSpinnerProps) {
  const spinnerClasses = cn(
    'animate-spin rounded-full border-transparent',
    sizeClasses[size],
    borderClasses[size],
    // Default theming
    variant === 'button' 
      ? 'border-b-white' 
      : 'border-b-[var(--color-theme-primary-600)]',
    className
  )

  const Spinner = (
    <div className={spinnerClasses} />
  )

  // Button variant - inline with text
  if (variant === 'button') {
    return (
      <div className="flex items-center">
        {Spinner}
        {showText && text && <span className="ml-2">{text}</span>}
      </div>
    )
  }

  // Page variant - full screen centered
  if (variant === 'page') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4">
            {Spinner}
          </div>
          {showText && text && (
            <p className="text-[var(--color-theme-text-secondary)]">
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Inline variant - just the spinner
  if (variant === 'inline') {
    return Spinner
  }

  // Default variant - centered with optional text
  return (
    <div className="flex items-center justify-center p-4">
      {Spinner}
      {showText && text && (
        <span 
          className="ml-3 text-[var(--color-theme-text-secondary)]"
        >
          {text}
        </span>
      )}
    </div>
  )
}