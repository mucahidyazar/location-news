import Image from 'next/image'
import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import {Grid3x3, List, MapPin, Settings, GitCommit, Menu, Shield} from 'lucide-react'
import {UserHeaderButton} from '@/components/user-header-button'
import {HeaderNavButton} from '@/components/ui/header-nav-button'
import { AuthWrapper } from '@/components/auth-wrapper'

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
  onToggleLoginSidebar?: () => void
  onToggleUserSidebar?: () => void
  onToggleAdminSidebar?: () => void
  className?: string
  isSidebarOpen?: boolean
  isSettingsSidebarOpen?: boolean
  isUpdatesSidebarOpen?: boolean
  isMenuSidebarOpen?: boolean
  isLoginSidebarOpen?: boolean
  isUserSidebarOpen?: boolean
  isAdminSidebarOpen?: boolean
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
  onToggleLoginSidebar,
  onToggleUserSidebar,
  onToggleAdminSidebar,
  className = '',
  isSidebarOpen = false,
  isSettingsSidebarOpen = false,
  isUpdatesSidebarOpen = false,
  isMenuSidebarOpen = false,
  isLoginSidebarOpen = false,
  isUserSidebarOpen = false,
  isAdminSidebarOpen = false,
}: CommonHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

  const isMapActive =
    pathname === '/' || (!pathname.includes('/news') && pathname !== '/news' && !pathname.includes('/admin'))
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
            <h1
              className="text-lg lg:text-xl font-bold font-[family-name:var(--font-josefin-sans)] text-[var(--color-theme-text-primary)]"
            >
              {title}
            </h1>
            <p
              className="text-xs text-center hidden leading-4 lg:block font-[family-name:var(--font-josefin-sans)] text-[var(--color-theme-text-secondary)]"
            >
              {subtitle}
            </p>
          </div>
        </Link>

        {/* Center: Pages (Desktop only) */}
        <ul className="nav-pages hidden md:flex items-center gap-2">
          {/* Home/Map Page */}
          <HeaderNavButton
            icon={MapPin}
            label="Map"
            isActive={isMapActive}
            onClick={() => router.push('/')}
          />

          {/* News Page */}
          {showNewsButton && (
            <HeaderNavButton
              icon={Grid3x3}
              label="News"
              isActive={isNewsActive}
              onClick={() => router.push('/news')}
            />
          )}

        </ul>

        {/* Right: Sidebars */}
        <ul className="nav-sidebars flex items-center gap-1 md:gap-2">
          {/* Feed Sidebar */}
          {showSidebarButton && onToggleSidebar && (
            <HeaderNavButton
              icon={List}
              label="Feed"
              isActive={isSidebarOpen}
              onClick={onToggleSidebar}
            />
          )}

          {/* Settings Sidebar */}
          {onToggleSettingsSidebar && (
            <HeaderNavButton
              icon={Settings}
              label="Settings"
              isActive={isSettingsSidebarOpen}
              onClick={onToggleSettingsSidebar}
            />
          )}

          {/* Updates Sidebar */}
          {onToggleUpdatesSidebar && (
            <HeaderNavButton
              icon={GitCommit}
              label="Updates"
              isActive={isUpdatesSidebarOpen}
              onClick={onToggleUpdatesSidebar}
            />
          )}

          {/* Moderasyon Sidebar */}
          <AuthWrapper>
            {onToggleAdminSidebar && (
              <HeaderNavButton
                icon={Shield}
                label="Moderasyon"
                isActive={isAdminSidebarOpen}
                onClick={onToggleAdminSidebar}
              />
            )}
          </AuthWrapper>

          {/* Menu Sidebar (Mobile only) - Far right */}
          {onToggleMenuSidebar && (
            <HeaderNavButton
              icon={Menu}
              label="Menu"
              isActive={isMenuSidebarOpen}
              onClick={onToggleMenuSidebar}
              className="md:hidden"
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
