import Image from 'next/image'
import Link from 'next/link'
import {
  Grid3x3,
  List,
  MapPin,
  Settings,
} from 'lucide-react'
import LanguageSwitcher from '@/components/ui/language-switcher'

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
  rightContent?: React.ReactNode
  className?: string
}

export default function CommonHeader({
  title = 'LocationNews',
  subtitle = 'Yerel Haberler, Gerçek Zamanlı',
  showLanguageSwitcher = false,
  showMapControls = false,
  showNewsButton = false,
  showSidebarButton = false,
  useCustomIcons = false,
  onToggleIcons,
  onToggleSidebar,
  rightContent,
  className = '',
}: CommonHeaderProps) {
  return (
    <header className={`bg-white border-b px-4 lg:px-6 py-3 z-[100] ${className}`}>
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Image 
            src="/logo.svg" 
            alt="LocationNews" 
            width={52} 
            height={52} 
            className="h-13 w-13" 
          />
          <div>
            <h1 className="text-xl lg:text-3xl font-bold text-gray-900 font-[family-name:var(--font-josefin-sans)]">
              {title}
            </h1>
            <p className="text-xs text-center text-gray-600 hidden leading-4 lg:block font-[family-name:var(--font-josefin-sans)]">
              {subtitle}
            </p>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          {showLanguageSwitcher && <LanguageSwitcher />}
          
          {showMapControls && onToggleIcons && (
            <button
              onClick={onToggleIcons}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title={useCustomIcons ? 'Basit İkonlar' : 'Özel İkonlar'}
            >
              {useCustomIcons ? (
                <MapPin className="w-5 h-5 text-gray-600" />
              ) : (
                <Settings className="w-5 h-5 text-gray-600" />
              )}
            </button>
          )}
          
          <div className="flex items-center gap-2">
            {showNewsButton && (
              <button
                onClick={() => (window.location.href = '/news')}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Haberler"
              >
                <Grid3x3 className="w-6 h-6 text-gray-600" />
              </button>
            )}
            
            {showSidebarButton && onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title="Detaylar"
              >
                <List className="w-6 h-6 text-gray-600" />
              </button>
            )}
          </div>
          
          {rightContent}
        </div>
      </div>
    </header>
  )
}