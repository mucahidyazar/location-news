'use client'

import {useState} from 'react'
import {Settings, Shield, Bell, Home} from 'lucide-react'
import {cn} from '@/lib/utils'
import {useTranslations} from 'next-intl'

interface FloatingMenuButtonProps {
  onModerateClick: () => void
  onUpdatesClick: () => void
  onSettingsClick: () => void
  onFeedClick: () => void
  isSidebarOpen?: boolean
  isAdmin?: boolean
  className?: string
}

export function FloatingMenuButton({
  onModerateClick,
  onUpdatesClick,
  onSettingsClick,
  onFeedClick,
  isSidebarOpen = false,
  isAdmin = false,
  className,
}: FloatingMenuButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = useTranslations()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleMenuItemClick = (action: () => void) => {
    action()
    setIsMenuOpen(false)
  }

  const baseMenuItems = [
    {
      icon: Home,
      label: t('menu.feed'),
      action: () => handleMenuItemClick(onFeedClick),
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: Settings,
      label: t('menu.settings'),
      action: () => handleMenuItemClick(onSettingsClick),
      color: 'bg-gray-500 hover:bg-gray-600',
    },
    {
      icon: Bell,
      label: t('menu.updates'),
      action: () => handleMenuItemClick(onUpdatesClick),
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ]

  // Add moderate option only for admin users
  const menuItems = isAdmin
    ? [
        ...baseMenuItems,
        {
          icon: Shield,
          label: t('menu.moderate'),
          action: () => handleMenuItemClick(onModerateClick),
          color: 'bg-red-500 hover:bg-red-600',
        },
      ]
    : baseMenuItems

  return (
    <div
      className="fixed z-40 flex flex-col items-end"
      style={{
        bottom: '100px', // Report button üstünde
        right: isSidebarOpen ? '420px' : '24px',
        transition: 'all 300ms ease-out',
      }}
    >
      {/* Menu Items */}
      <div
        className={cn(
          'flex flex-col items-end gap-3 mb-4 mx-1',
          'transition-all duration-300 ease-out',
          isMenuOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-8 opacity-0 pointer-events-none',
        )}
      >
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className={cn(
                'flex items-center gap-3',
                'transform transition-all duration-300 ease-out',
              )}
              style={{
                transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
              }}
            >
              {/* Label */}
              <div
                className={cn(
                  'bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium',
                  'backdrop-blur-sm shadow-lg',
                  'whitespace-nowrap',
                  'transform transition-all duration-200',
                  'hover:bg-black/90',
                )}
              >
                {item.label}
              </div>

              {/* Button */}
              <button
                onClick={item.action}
                className={cn(
                  'w-12 h-12 rounded-full shadow-lg',
                  'flex items-center justify-center',
                  'transition-all duration-200 ease-out',
                  'hover:scale-110 hover:shadow-xl',
                  'active:scale-95',
                  'text-white',
                  item.color,
                )}
                title={item.label}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Main Settings Button */}
      <button
        onClick={toggleMenu}
        className={cn(
          'w-14 h-14 rounded-full shadow-lg',
          'flex items-center justify-center',
          'transition-all duration-300 ease-out',
          'hover:scale-110 hover:shadow-xl',
          'active:scale-95',
          'text-white',
          // Dynamic colors based on menu state
          isMenuOpen
            ? '[background-color:var(--color-theme-primary-600)] hover:[background-color:var(--color-theme-primary-700)]'
            : '[background-color:var(--color-theme-secondary-500)] hover:[background-color:var(--color-theme-secondary-600)]',
          className,
        )}
        title={isMenuOpen ? t('menu.close') : t('menu.options')}
        aria-label={isMenuOpen ? t('menu.close') : t('menu.options')}
      >
        <Settings
          className={cn(
            'w-6 h-6 transition-transform duration-300 ease-out',
            isMenuOpen && 'rotate-180',
          )}
        />
      </button>
    </div>
  )
}
