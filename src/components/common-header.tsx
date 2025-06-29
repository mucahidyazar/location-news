import Image from 'next/image'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {Grid3x3, List, MapPin, Settings, GitCommit, Menu} from 'lucide-react'

interface CommonHeaderProps {
  title?: string
  subtitle?: string
  showLanguageSwitcher?: boolean
  showMapControls?: boolean
  showNewsButton?: boolean
  showSidebarButton?: boolean
  useCustomIcons?: boolean
  onToggleIcons?: () => void
  onToggleSidebar?: () => void
  onToggleSettingsSidebar?: () => void
  onToggleUpdatesSidebar?: () => void
  onToggleMenuSidebar?: () => void
  rightContent?: React.ReactNode
  className?: string
  isSidebarOpen?: boolean
  isSettingsSidebarOpen?: boolean
  isUpdatesSidebarOpen?: boolean
  isMenuSidebarOpen?: boolean
}

export default function CommonHeader({
  title = 'mappy.news',
  subtitle = 'Yerel Haberler, Gerçek Zamanlı',
  showNewsButton = false,
  showSidebarButton = false,
  onToggleSidebar,
  onToggleSettingsSidebar,
  onToggleUpdatesSidebar,
  onToggleMenuSidebar,
  rightContent,
  className = '',
  isSidebarOpen = false,
  isSettingsSidebarOpen = false,
  isUpdatesSidebarOpen = false,
  isMenuSidebarOpen = false,
}: CommonHeaderProps) {
  const pathname = usePathname()
  return (
    <header
      className={`border-b px-4 lg:px-6 py-1 z-[100] ${className}`}
      style={{
        backgroundColor: 'var(--color-theme-surface-primary)',
        borderColor: 'var(--color-theme-border-primary)',
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.svg"
            alt="mappy.news"
            width={52}
            height={52}
            className="h-10 w-10"
          />
          <div>
            <h1
              className="text-lg lg:text-xl font-bold font-[family-name:var(--font-josefin-sans)]"
              style={{color: 'var(--color-theme-text-primary)'}}
            >
              {title}
            </h1>
            <p
              className="text-xs text-center hidden leading-4 lg:block font-[family-name:var(--font-josefin-sans)]"
              style={{color: 'var(--color-theme-text-secondary)'}}
            >
              {subtitle}
            </p>
          </div>
        </Link>

        {/* Center: Pages (Desktop only) */}
        <ul className="nav-pages hidden md:flex items-center gap-2">
          {/* Home/Map Page */}
          <li className="relative">
            <Link
              href="/"
              className="flex flex-col items-center p-3 transition-all duration-200 text-xs min-w-[80px] rounded-lg"
              style={{
                color:
                  pathname === '/' ||
                  (!pathname.includes('/news') && pathname !== '/news')
                    ? 'var(--color-theme-primary-600)'
                    : 'var(--color-theme-text-secondary)',
                backgroundColor:
                  pathname === '/' ||
                  (!pathname.includes('/news') && pathname !== '/news')
                    ? 'var(--color-theme-primary-50)'
                    : 'transparent',
                fontWeight:
                  pathname === '/' ||
                  (!pathname.includes('/news') && pathname !== '/news')
                    ? '600'
                    : '400',
              }}
              onMouseEnter={e => {
                if (
                  !(
                    pathname === '/' ||
                    (!pathname.includes('/news') && pathname !== '/news')
                  )
                ) {
                  e.currentTarget.style.backgroundColor =
                    'var(--color-theme-primary-50)'
                  e.currentTarget.style.color = 'var(--color-theme-primary-600)'
                  e.currentTarget.style.fontWeight = '600'
                }
              }}
              onMouseLeave={e => {
                if (
                  !(
                    pathname === '/' ||
                    (!pathname.includes('/news') && pathname !== '/news')
                  )
                ) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color =
                    'var(--color-theme-text-secondary)'
                  e.currentTarget.style.fontWeight = '400'
                }
              }}
              title="Map"
            >
              <MapPin className="w-5 h-5 mb-1" />
              <span>Map</span>
            </Link>
            {(pathname === '/' ||
              (!pathname.includes('/news') && pathname !== '/news')) && (
              <div
                className="absolute -bottom-1 left-0 right-0 h-0.5 shadow-lg"
                style={{backgroundColor: 'var(--color-theme-primary-100)'}}
              ></div>
            )}
          </li>

          {/* News Page */}
          {showNewsButton && (
            <li className="relative">
              <Link
                href="/news"
                className="flex flex-col items-center p-3 transition-all duration-200 text-xs min-w-[80px] rounded-lg"
                style={{
                  color: pathname.includes('/news')
                    ? 'var(--color-theme-primary-600)'
                    : 'var(--color-theme-text-secondary)',
                  backgroundColor: pathname.includes('/news')
                    ? 'var(--color-theme-primary-50)'
                    : 'transparent',
                  fontWeight: pathname.includes('/news') ? '600' : '400',
                }}
                onMouseEnter={e => {
                  if (!pathname.includes('/news')) {
                    e.currentTarget.style.backgroundColor =
                      'var(--color-theme-primary-50)'
                    e.currentTarget.style.color =
                      'var(--color-theme-primary-600)'
                    e.currentTarget.style.fontWeight = '600'
                  }
                }}
                onMouseLeave={e => {
                  if (!pathname.includes('/news')) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color =
                      'var(--color-theme-text-secondary)'
                    e.currentTarget.style.fontWeight = '400'
                  }
                }}
                title="News"
              >
                <Grid3x3 className="w-5 h-5 mb-1" />
                <span>News</span>
              </Link>
              {pathname.includes('/news') && (
                <div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 shadow-lg"
                  style={{backgroundColor: 'var(--color-theme-primary-100)'}}
                ></div>
              )}
            </li>
          )}
        </ul>

        {/* Right: Sidebars */}
        <ul className="nav-sidebars flex items-center gap-1 md:gap-2">
          {/* Feed Sidebar */}
          {showSidebarButton && onToggleSidebar && (
            <li className="relative">
              <a
                href="#"
                onClick={e => {
                  e.preventDefault()
                  onToggleSidebar()
                }}
                className="flex flex-col items-center py-2 px-0 md:p-3 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px]"
                style={{
                  color: isSidebarOpen
                    ? 'var(--color-theme-primary-600)'
                    : 'var(--color-theme-text-secondary)',
                  backgroundColor: isSidebarOpen
                    ? 'var(--color-theme-primary-50)'
                    : 'transparent',
                  boxShadow: isSidebarOpen
                    ? '0 1px 2px 0 var(--color-theme-bg-overlay)'
                    : 'none',
                }}
                onMouseEnter={e => {
                  if (!isSidebarOpen) {
                    e.currentTarget.style.backgroundColor =
                      'var(--color-theme-primary-50)'
                    e.currentTarget.style.color =
                      'var(--color-theme-primary-500)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isSidebarOpen) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color =
                      'var(--color-theme-text-secondary)'
                  }
                }}
                title="Feed"
              >
                <List
                  className={`w-5 h-5 mb-1 transition-transform duration-300 ${
                    isSidebarOpen ? 'scale-110 rotate-12' : ''
                  }`}
                />
                <span>Feed</span>
              </a>
              {isSidebarOpen && (
                <div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 shadow-lg"
                  style={{backgroundColor: 'var(--color-theme-primary-100)'}}
                ></div>
              )}
            </li>
          )}

          {/* Settings Sidebar */}
          {onToggleSettingsSidebar && (
            <li className="relative">
              <a
                href="#"
                onClick={e => {
                  e.preventDefault()
                  onToggleSettingsSidebar()
                }}
                className="flex flex-col items-center py-2 px-0 md:p-3 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px]"
                style={{
                  color: isSettingsSidebarOpen
                    ? 'var(--color-theme-primary-600)'
                    : 'var(--color-theme-text-secondary)',
                  backgroundColor: isSettingsSidebarOpen
                    ? 'var(--color-theme-primary-50)'
                    : 'transparent',
                  boxShadow: isSettingsSidebarOpen
                    ? '0 1px 2px 0 var(--color-theme-bg-overlay)'
                    : 'none',
                }}
                onMouseEnter={e => {
                  if (!isSettingsSidebarOpen) {
                    e.currentTarget.style.backgroundColor =
                      'var(--color-theme-primary-50)'
                    e.currentTarget.style.color =
                      'var(--color-theme-primary-500)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isSettingsSidebarOpen) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color =
                      'var(--color-theme-text-secondary)'
                  }
                }}
                title="Settings"
              >
                <Settings
                  className={`w-5 h-5 mb-1 transition-transform duration-300 ${
                    isSettingsSidebarOpen ? 'scale-110 rotate-90' : ''
                  }`}
                />
                <span>Settings</span>
              </a>
              {isSettingsSidebarOpen && (
                <div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 shadow-lg"
                  style={{backgroundColor: 'var(--color-theme-primary-100)'}}
                ></div>
              )}
            </li>
          )}

          {/* Updates Sidebar */}
          {onToggleUpdatesSidebar && (
            <li className="relative">
              <a
                href="#"
                onClick={e => {
                  e.preventDefault()
                  onToggleUpdatesSidebar()
                }}
                className="flex flex-col items-center py-2 px-0 md:p-3 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px]"
                style={{
                  color: isUpdatesSidebarOpen
                    ? 'var(--color-theme-primary-600)'
                    : 'var(--color-theme-text-secondary)',
                  backgroundColor: isUpdatesSidebarOpen
                    ? 'var(--color-theme-primary-50)'
                    : 'transparent',
                  boxShadow: isUpdatesSidebarOpen
                    ? '0 1px 2px 0 var(--color-theme-bg-overlay)'
                    : 'none',
                }}
                onMouseEnter={e => {
                  if (!isUpdatesSidebarOpen) {
                    e.currentTarget.style.backgroundColor =
                      'var(--color-theme-primary-50)'
                    e.currentTarget.style.color =
                      'var(--color-theme-primary-500)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isUpdatesSidebarOpen) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color =
                      'var(--color-theme-text-secondary)'
                  }
                }}
                title="Updates"
              >
                <GitCommit
                  className={`w-5 h-5 mb-1 transition-transform duration-300 ${
                    isUpdatesSidebarOpen ? 'scale-110 rotate-12' : ''
                  }`}
                />
                <span>Updates</span>
              </a>
              {isUpdatesSidebarOpen && (
                <div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 shadow-lg"
                  style={{backgroundColor: 'var(--color-theme-primary-100)'}}
                ></div>
              )}
            </li>
          )}

          {/* Menu Sidebar (Mobile only) - Far right */}
          {onToggleMenuSidebar && (
            <li className="relative md:hidden">
              <a
                href="#"
                onClick={e => {
                  e.preventDefault()
                  onToggleMenuSidebar()
                }}
                className={`flex flex-col items-center py-2 px-0 hover:bg-green-50 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] ${
                  isMenuSidebarOpen
                    ? 'text-green-600 bg-green-50 shadow-sm'
                    : 'text-gray-600 hover:text-green-500'
                }`}
                title="Menu"
              >
                <Menu
                  className={`w-5 h-5 mb-1 transition-transform duration-300 ${
                    isMenuSidebarOpen ? 'scale-110 rotate-12' : ''
                  }`}
                />
                <span>Menu</span>
              </a>
              {isMenuSidebarOpen && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-600 animate-pulse shadow-lg"></div>
              )}
            </li>
          )}

          {rightContent && <li>{rightContent}</li>}
        </ul>
      </div>
    </header>
  )
}
