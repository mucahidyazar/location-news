'use client'

import Image from 'next/image'
import {cn} from '@/lib/utils'

interface LogoLoadingProps {
  text?: string
  className?: string
  variant?: 'page' | 'overlay' | 'inline'
  showText?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const logoSizes = {
  sm: {width: 40, height: 40, className: 'w-10 h-10'},
  md: {width: 60, height: 60, className: 'w-15 h-15'},
  lg: {width: 80, height: 80, className: 'w-20 h-20'},
  xl: {width: 120, height: 120, className: 'w-30 h-30'},
}

export function LogoLoading({
  text = 'Loading...',
  className,
  variant = 'page',
  showText = true,
  size = 'lg',
}: LogoLoadingProps) {
  const logoConfig = logoSizes[size]

  const LogoSpinner = (
    <div className="relative">
      {/* Outer rotating square ring - full border */}
      <div
        className={cn(
          'absolute inset-0 border-4 animate-spin',
          'border-[var(--color-theme-primary-500)]',
          // Square with rounded corners for modern look
          'rounded-xl',
          logoConfig.className,
        )}
        style={{
          animationDuration: '2s',
        }}
      />

      {/* Inner rotating square ring - different color */}
      <div
        className={cn(
          'absolute border-2 animate-spin',
          'border-[var(--color-theme-secondary-400)]',
          // Smaller rounded corners for inner ring
          'rounded-lg',
          // Different inset values for different sizes
          size === 'sm' ? 'inset-1' : size === 'md' ? 'inset-1.5' : 'inset-2',
        )}
        style={{
          animationDuration: '3s',
          animationDirection: 'reverse', // Counter-clockwise
        }}
      />

      {/* Logo in center with subtle square background */}
      <div
        className={cn(
          'relative flex items-center justify-center',
          logoConfig.className,
          // Subtle square background that matches the logo
          'bg-white/40',
          'rounded-lg',
        )}
        style={{
          animationDuration: '4s',
        }}
      >
        <Image
          src="/logo.svg"
          alt="mappy.news"
          width={logoConfig.width}
          height={logoConfig.height}
          className={cn(
            'drop-shadow-md transition-all duration-500',
            // Logo stays square to match the square rings
            size === 'sm'
              ? 'w-6 h-6 p-1'
              : size === 'md'
              ? 'w-10 h-10 p-1'
              : size === 'lg'
              ? 'w-16 h-16 p-2'
              : 'w-24 h-24 p-3',
            'rounded-sm', // Slight rounding to match square theme
          )}
          priority
        />
      </div>
    </div>
  )

  // Page variant - full screen centered with gradient background
  if (variant === 'page') {
    return (
      <div
        className={cn(
          'min-h-screen flex items-center justify-center pb-24',
          'bg-gradient-to-br from-[var(--color-theme-surface-primary)] via-[var(--color-theme-surface-secondary)] to-[var(--color-theme-primary-50)]',
          className,
        )}
      >
        <div className="text-center space-y-6">
          {/* Logo with animations */}
          <div className="flex justify-center">{LogoSpinner}</div>

          {/* Text with typing animation */}
          {showText && text && (
            <div className="space-y-3">
              <p
                className={cn(
                  'text-lg font-medium animate-pulse',
                  'text-[var(--color-theme-text-primary)]',
                  'font-[family-name:var(--font-josefin-sans)]',
                )}
                style={{
                  animationDuration: '2s',
                }}
              >
                {text}
              </p>

              {/* Animated dots */}
              <div className="flex justify-center space-x-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={cn(
                      'w-2 h-2 rounded-full animate-bounce',
                      'bg-[var(--color-theme-primary-500)]',
                    )}
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1.5s',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Animated Brand Name */}
          <div
            className={cn(
              'animate-fade-in mt-14',
              'text-[var(--color-theme-text-primary)]',
              'font-[family-name:var(--font-josefin-sans)]',
            )}
            style={{
              animationDelay: '0.5s',
              animationDuration: '1s',
              animationFillMode: 'both',
            }}
          >
            {'mappy.news'.split('').map((char, index) => (
              <span
                key={index}
                className={cn('inline-block animate-wave')}
                style={{
                  animationDelay: `${0.8 + index * 0.15}s`,
                  animationDuration: '2.5s',
                  animationIterationCount: 'infinite',
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Overlay variant - positioned overlay
  if (variant === 'overlay') {
    return (
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          'bg-black/20 backdrop-blur-sm',
          className,
        )}
      >
        <div
          className={cn(
            'bg-white/95 backdrop-blur-md rounded-xl shadow-2xl',
            'border border-white/20 p-8 text-center space-y-4',
            'animate-fade-in',
          )}
        >
          <div className="flex justify-center">{LogoSpinner}</div>

          {showText && text && (
            <p
              className={cn(
                'text-base font-medium',
                'text-[var(--color-theme-text-primary)]',
              )}
            >
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Inline variant - just the logo spinner
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {LogoSpinner}
      {showText && text && (
        <span
          className={cn(
            'ml-4 text-[var(--color-theme-text-secondary)]',
            size === 'sm' ? 'text-sm' : 'text-base',
          )}
        >
          {text}
        </span>
      )}
    </div>
  )
}
