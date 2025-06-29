'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, MapPin, Grid3x3 } from 'lucide-react'

interface MenuSidebarProps {
  onClose: () => void
  showNewsButton?: boolean
}

export default function MenuSidebar({ onClose, showNewsButton = false }: MenuSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span>📱</span>
          Menu
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
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
            className={`flex items-center gap-3 p-4 rounded-lg transition-all hover:bg-gray-50 ${
              pathname === '/' || !pathname.includes('/news')
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
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
              className={`flex items-center gap-3 p-4 rounded-lg transition-all hover:bg-gray-50 ${
                pathname.includes('/news')
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
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
      <div className="p-4 border-t bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Navigation Menu
        </p>
      </div>
    </div>
  )
}