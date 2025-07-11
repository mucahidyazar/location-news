'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Grid3x3, Shield, FileText } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import {cn} from '@/lib/utils'
import {SidebarHeader} from '@/components/ui/sidebar-header'

interface MenuSidebarProps {
  onClose: () => void
  showNewsButton?: boolean
}

export default function MenuSidebar({ onClose, showNewsButton = false }: MenuSidebarProps) {
  const pathname = usePathname()
  const { palette } = useTheme()

  return (
    <div className={cn("h-full flex flex-col", `[background-color:${palette.surface.primary}]`)}>
      {/* Header */}
      <SidebarHeader
        icon={<span>📱</span>}
        title="Menu"
        onClose={onClose}
      />

      {/* Navigation Items */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {/* Map Page */}
          <Link
            href="/"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 p-4 rounded-lg transition-all",
              (pathname === '/' || !pathname.includes('/news')) 
                ? `[background-color:${palette.primary[50]}] [color:${palette.primary[600]}] [border-left:4px_solid_${palette.primary[600]}]`
                : `[color:${palette.text.secondary}] hover:[background-color:${palette.surface.secondary}] hover:[color:${palette.primary[600]}]`
            )}
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
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg transition-all",
                pathname.includes('/news') 
                  ? `[background-color:${palette.primary[50]}] [color:${palette.primary[600]}] [border-left:4px_solid_${palette.primary[600]}]`
                  : `[color:${palette.text.secondary}] hover:[background-color:${palette.surface.secondary}] hover:[color:${palette.primary[600]}]`
              )}
            >
              <Grid3x3 className="w-5 h-5" />
              <div>
                <div className="font-medium">News</div>
                <div className="text-xs opacity-75">Browse all news</div>
              </div>
            </Link>
          )}
        </div>

        {/* Legal Pages Section */}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: palette.border.primary }}>
          <h3 className={cn("text-xs font-medium mb-2 px-2", `[color:${palette.text.tertiary}]`)}>
            Legal
          </h3>
          <div className="space-y-2">
            {/* Privacy Policy */}
            <Link
              href="/privacy-policy"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all",
                pathname.includes('/privacy-policy') 
                  ? `[background-color:${palette.primary[50]}] [color:${palette.primary[600]}] [border-left:4px_solid_${palette.primary[600]}]`
                  : `[color:${palette.text.secondary}] hover:[background-color:${palette.surface.secondary}] hover:[color:${palette.primary[600]}]`
              )}
            >
              <Shield className="w-4 h-4" />
              <div>
                <div className="font-medium text-sm">Privacy Policy</div>
                <div className="text-xs opacity-75">How we protect your data</div>
              </div>
            </Link>

            {/* Terms and Conditions */}
            <Link
              href="/terms-and-conditions"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all",
                pathname.includes('/terms-and-conditions') 
                  ? `[background-color:${palette.primary[50]}] [color:${palette.primary[600]}] [border-left:4px_solid_${palette.primary[600]}]`
                  : `[color:${palette.text.secondary}] hover:[background-color:${palette.surface.secondary}] hover:[color:${palette.primary[600]}]`
              )}
            >
              <FileText className="w-4 h-4" />
              <div>
                <div className="font-medium text-sm">Terms & Conditions</div>
                <div className="text-xs opacity-75">Rules and guidelines</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={cn(
        "p-4 border-t",
        `[background-color:${palette.surface.secondary}]`,
        `[border-color:${palette.border.primary}]`
      )}>
        <div className="flex justify-center gap-4 mb-2">
          <Link
            href="/privacy-policy"
            onClick={onClose}
            className={cn("text-xs hover:underline", `[color:${palette.text.tertiary}]`)}
          >
            Privacy
          </Link>
          <span className={cn("text-xs", `[color:${palette.text.tertiary}]`)}>•</span>
          <Link
            href="/terms-and-conditions"
            onClick={onClose}
            className={cn("text-xs hover:underline", `[color:${palette.text.tertiary}]`)}
          >
            Terms
          </Link>
        </div>
        <p className={cn("text-xs text-center", `[color:${palette.text.tertiary}]`)}>
          © 2024 Mappy.News
        </p>
      </div>
    </div>
  )
}