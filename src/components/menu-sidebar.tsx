'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, MapPin, Grid3x3 } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'

interface MenuSidebarProps {
  onClose: () => void
  showNewsButton?: boolean
}

export default function MenuSidebar({ onClose, showNewsButton = false }: MenuSidebarProps) {
  const pathname = usePathname()
  const { palette } = useTheme()

  return (
    <div className="h-full flex flex-col" style={{backgroundColor: palette.surface.primary}}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{
        background: 'linear-gradient(135deg, var(--color-theme-secondary-200) 0%, var(--color-theme-secondary-300) 50%, var(--color-theme-primary-200) 100%)',
        borderColor: palette.border.primary
      }}>
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{color: palette.text.primary}}>
          <span>📱</span>
          Menu
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full transition-colors"
          style={{color: palette.text.secondary}}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = palette.surface.secondary
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {/* Map Page */}
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 p-4 rounded-lg transition-all"
            style={{
              backgroundColor: (pathname === '/' || !pathname.includes('/news')) ? palette.primary[50] : 'transparent',
              color: (pathname === '/' || !pathname.includes('/news')) ? palette.primary[600] : palette.text.secondary,
              borderLeft: (pathname === '/' || !pathname.includes('/news')) ? `4px solid ${palette.primary[600]}` : 'none'
            }}
            onMouseEnter={(e) => {
              if (!(pathname === '/' || !pathname.includes('/news'))) {
                e.currentTarget.style.backgroundColor = palette.surface.secondary
                e.currentTarget.style.color = palette.primary[600]
              }
            }}
            onMouseLeave={(e) => {
              if (!(pathname === '/' || !pathname.includes('/news'))) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = palette.text.secondary
              }
            }}
          >
            <MapPin className="w-5 h-5" />
            <div>
              <div className="font-medium">Map</div>
              <div className="text-xs opacity-75">Interactive location map</div>
            </div>
          </Link>

          {/* News Page */}
          {showNewsButton && (
            <Link
              href="/news"
              onClick={onClose}
              className="flex items-center gap-3 p-4 rounded-lg transition-all"
              style={{
                backgroundColor: pathname.includes('/news') ? palette.primary[50] : 'transparent',
                color: pathname.includes('/news') ? palette.primary[600] : palette.text.secondary,
                borderLeft: pathname.includes('/news') ? `4px solid ${palette.primary[600]}` : 'none'
              }}
              onMouseEnter={(e) => {
                if (!pathname.includes('/news')) {
                  e.currentTarget.style.backgroundColor = palette.surface.secondary
                  e.currentTarget.style.color = palette.primary[600]
                }
              }}
              onMouseLeave={(e) => {
                if (!pathname.includes('/news')) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = palette.text.secondary
                }
              }}
            >
              <Grid3x3 className="w-5 h-5" />
              <div>
                <div className="font-medium">News</div>
                <div className="text-xs opacity-75">Browse all news</div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t" style={{
        backgroundColor: palette.surface.secondary,
        borderColor: palette.border.primary
      }}>
        <p className="text-xs text-center" style={{color: palette.text.tertiary}}>
          Navigation Menu
        </p>
      </div>
    </div>
  )
}