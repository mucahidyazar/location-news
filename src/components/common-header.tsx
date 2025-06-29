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
  title = 'LocationNews',
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
      className={`bg-white border-b px-4 lg:px-6 py-1 z-[100] ${className}`}
    >
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.svg"
            alt="LocationNews"
            width={52}
            height={52}
            className="h-10 w-10"
          />
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-gray-900 font-[family-name:var(--font-josefin-sans)]">
              {title}
            </h1>
            <p className="text-xs text-center text-gray-600 hidden leading-4 lg:block font-[family-name:var(--font-josefin-sans)]">
              {subtitle}
            </p>
          </div>
        </Link>

        {/* Center: Pages (Desktop only) */}
        <ul className="nav-pages hidden md:flex items-center">
          {/* Home/Map Page */}
          <li className="relative">
            <Link
              href="/"
              className={`flex flex-col items-center p-3 hover:bg-gray-50 transition-colors text-xs min-w-[80px] ${
                pathname === '/' || !pathname.includes('/news')
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
              title="Map"
            >
              <MapPin className="w-5 h-5 mb-1" />
              <span>Map</span>
            </Link>
            {(pathname === '/' || !pathname.includes('/news')) && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </li>

          {/* News Page */}
          {showNewsButton && (
            <li className="relative">
              <Link
                href="/news"
                className={`flex flex-col items-center p-3 hover:bg-gray-50 transition-colors text-xs min-w-[80px] ${
                  pathname.includes('/news') ? 'text-blue-600' : 'text-gray-600'
                }`}
                title="News"
              >
                <Grid3x3 className="w-5 h-5 mb-1" />
                <span>News</span>
              </Link>
              {pathname.includes('/news') && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600"></div>
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
                className={`flex flex-col items-center py-2 px-0 md:p-3 hover:bg-blue-50 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px] ${
                  isSidebarOpen ? 'text-blue-600 bg-blue-50 shadow-sm' : 'text-gray-600 hover:text-blue-500'
                }`}
                title="Feed"
              >
                <List className={`w-5 h-5 mb-1 transition-transform duration-300 ${
                  isSidebarOpen ? 'scale-110 rotate-12' : ''
                }`} />
                <span>Feed</span>
              </a>
              {isSidebarOpen && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 animate-pulse shadow-lg"></div>
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
                className={`flex flex-col items-center py-2 px-0 md:p-3 hover:bg-blue-50 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px] ${
                  isSettingsSidebarOpen ? 'text-blue-600 bg-blue-50 shadow-sm' : 'text-gray-600 hover:text-blue-500'
                }`}
                title="Settings"
              >
                <Settings className={`w-5 h-5 mb-1 transition-transform duration-300 ${
                  isSettingsSidebarOpen ? 'scale-110 rotate-90' : ''
                }`} />
                <span>Settings</span>
              </a>
              {isSettingsSidebarOpen && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 animate-pulse shadow-lg"></div>
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
                className={`flex flex-col items-center py-2 px-0 md:p-3 hover:bg-purple-50 transition-all duration-300 ease-out text-xs rounded-lg min-w-[56px] md:min-w-[80px] ${
                  isUpdatesSidebarOpen ? 'text-purple-600 bg-purple-50 shadow-sm' : 'text-gray-600 hover:text-purple-500'
                }`}
                title="Updates"
              >
                <GitCommit className={`w-5 h-5 mb-1 transition-transform duration-300 ${
                  isUpdatesSidebarOpen ? 'scale-110 rotate-12' : ''
                }`} />
                <span>Updates</span>
              </a>
              {isUpdatesSidebarOpen && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-600 animate-pulse shadow-lg"></div>
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
                  isMenuSidebarOpen ? 'text-green-600 bg-green-50 shadow-sm' : 'text-gray-600 hover:text-green-500'
                }`}
                title="Menu"
              >
                <Menu className={`w-5 h-5 mb-1 transition-transform duration-300 ${
                  isMenuSidebarOpen ? 'scale-110 rotate-12' : ''
                }`} />
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
