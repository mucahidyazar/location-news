import Image from 'next/image'
import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import {Grid3x3, List, MapPin, Menu} from 'lucide-react'
import {UserHeaderButton} from '@/components/user-header-button'
import {HeaderNavButton} from '@/components/ui/header-nav-button'

interface CommonHeaderProps {
  title?: string
  subtitle?: string
  showNewsButton?: boolean
  showSidebarButton?: boolean
  onToggleSidebar?: () => void
  onToggleMenuSidebar?: () => void
  onToggleLoginSidebar?: () => void
  onToggleUserSidebar?: () => void
  className?: string
  isSidebarOpen?: boolean
  isMenuSidebarOpen?: boolean
  isLoginSidebarOpen?: boolean
  isUserSidebarOpen?: boolean
}

export default function CommonHeader({
  title = 'mappy.news',
  subtitle = 'Yerel Haberler, Gerçek Zamanlı',
  showNewsButton = false,
  showSidebarButton = false,
  onToggleSidebar,
  onToggleMenuSidebar,
  onToggleLoginSidebar,
  onToggleUserSidebar,
  className = '',
  isSidebarOpen = false,
  isMenuSidebarOpen = false,
  isLoginSidebarOpen = false,
  isUserSidebarOpen = false,
}: CommonHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

  const isMapActive =
    pathname === '/' ||
    (!pathname.includes('/news') &&
      pathname !== '/news' &&
      !pathname.includes('/admin'))
  const isNewsActive = pathname.includes('/news')
  // const isAdminActive = pathname.includes('/admin')

  return (
    <header
      className={`border-b px-4 lg:px-6 py-1 z-[100] bg-[var(--color-theme-surface-primary)] border-[var(--color-theme-border-primary)] ${className}`}
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
            <h1 className="text-lg lg:text-xl font-bold font-[family-name:var(--font-josefin-sans)] text-[var(--color-theme-text-primary)]">
              {title}
            </h1>
            <p className="text-xs text-center hidden leading-4 lg:block font-[family-name:var(--font-josefin-sans)] text-[var(--color-theme-text-secondary)]">
              {subtitle}
            </p>
          </div>
        </Link>

        {/* Right: Sidebars */}
        <ul className="nav-sidebars flex items-center gap-1 md:gap-2">
          {/* Mobile Menu Button - Only visible on mobile */}
          {onToggleMenuSidebar && (
            <HeaderNavButton
              icon={Menu}
              label="Menu"
              isActive={isMenuSidebarOpen}
              onClick={onToggleMenuSidebar}
              className="md:hidden"
            />
          )}

          {/* Feed Sidebar */}
          {showSidebarButton && onToggleSidebar && (
            <HeaderNavButton
              icon={List}
              label="Feed"
              isActive={isSidebarOpen}
              onClick={onToggleSidebar}
            />
          )}

          {/* Home/Map Page - Hidden on mobile when menu is available */}
          <HeaderNavButton
            icon={MapPin}
            label="Map"
            isActive={isMapActive}
            onClick={() => router.push('/')}
            className={onToggleMenuSidebar ? "hidden md:flex" : ""}
          />

          {/* News Page - Hidden on mobile when menu is available */}
          {showNewsButton && (
            <HeaderNavButton
              icon={Grid3x3}
              label="News"
              isActive={isNewsActive}
              onClick={() => router.push('/news')}
              className={onToggleMenuSidebar ? "hidden md:flex" : ""}
            />
          )}

          {/* Auth Section */}
          <li>
            <UserHeaderButton
              onToggleLoginSidebar={onToggleLoginSidebar}
              onToggleUserSidebar={onToggleUserSidebar}
              isLoginSidebarOpen={isLoginSidebarOpen}
              isUserSidebarOpen={isUserSidebarOpen}
            />
          </li>
        </ul>
      </div>
    </header>
  )
}
