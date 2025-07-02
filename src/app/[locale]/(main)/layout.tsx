'use client'

import {useState, useEffect, useCallback} from 'react'
import CommonHeader from '@/components/common-header'
import NewsSidebar from '@/components/news-sidebar'
import UpdatesSidebar from '@/components/updates-sidebar'
import MenuSidebar from '@/components/menu-sidebar'
import LanguageSwitcher from '@/components/ui/language-switcher'
import {ThemeSwitcher} from '@/components/ui/theme-switcher'
import {useTranslations} from 'next-intl'
import {MainLayoutProvider, useMainLayout} from '@/contexts/main-layout-context'
import {NewsItem, Location} from '@/lib/types'
import {cn} from '@/lib/utils'
import {LoginSidebar} from '@/components/login-sidebar'
import {UserSidebar} from '@/components/user-sidebar'
import {AdminSidebar} from '@/components/admin-sidebar'
import {SidebarHeader} from '@/components/ui/sidebar-header'

interface MainLayoutProps {
  children: React.ReactNode
}

function MainLayoutInner({children}: MainLayoutProps) {
  const t = useTranslations()
  const {
    useCustomIcons,
    setUseCustomIcons,
    isSidebarOpen,
    setIsSidebarOpen,
    isSettingsSidebarOpen,
    setIsSettingsSidebarOpen,
    isUpdatesSidebarOpen,
    setIsUpdatesSidebarOpen,
    isMenuSidebarOpen,
    setIsMenuSidebarOpen,
    isUserSidebarOpen,
    setIsUserSidebarOpen,
    isAdminSidebarOpen,
    setIsAdminSidebarOpen,
  } = useMainLayout()

  // Login sidebar state
  const [isLoginSidebarOpen, setIsLoginSidebarOpen] = useState(false)

  // News data for sidebar
  const [news, setNews] = useState<NewsItem[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [newsLoaded, setNewsLoaded] = useState(0)
  const NEWS_PER_PAGE = 20

  // Sidebar filters
  const [selectedLocation, setSelectedLocation] = useState<string>()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    t('filters.all'),
  ])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{start?: string; end?: string}>({})
  const [viewType, setViewType] = useState<'card' | 'horizontal' | 'minimal'>(
    'card',
  )

  const loadSidebarData = useCallback(
    async (loadMore = false) => {
      try {
        if (loadMore) {
          setLoadingMore(true)
        } else {
          setLoading(true)
        }

        const currentOffset = loadMore ? newsLoaded : 0
        const currentLimit = loadMore ? NEWS_PER_PAGE : NEWS_PER_PAGE

        const params = new URLSearchParams({
          limit: currentLimit.toString(),
          offset: currentOffset.toString(),
        })

        const promises = [fetch(`/api/news?${params.toString()}`)]

        if (!loadMore) {
          promises.push(fetch('/api/locations'))
        }

        const responses = await Promise.all(promises)
        const newsData = await responses[0].json()

        if (loadMore) {
          setNews(prev => {
            const newNews = [...prev, ...newsData]
            return newNews
          })
          setNewsLoaded(prev => prev + newsData.length)
        } else {
          setNews(newsData)
          setNewsLoaded(newsData.length)

          if (responses.length > 1) {
            const locationsData = await responses[1].json()
            const transformedLocations: Location[] = locationsData.map(
              (
                item: {
                  name: string
                  latitude: number
                  longitude: number
                  news_count: number
                  primary_category: string
                },
                index: number,
              ) => ({
                id: index + 1,
                name: item.name,
                latitude: item.latitude,
                longitude: item.longitude,
                news_count: item.news_count,
                primaryCategory: item.primary_category,
              }),
            )
            setLocations(transformedLocations)
          }
        }

        // Check if there are more news to load (if we got less than requested, no more)
        setHasMore(newsData.length === NEWS_PER_PAGE)
      } catch (error) {
        console.error('Error loading sidebar data:', error)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [newsLoaded, NEWS_PER_PAGE],
  )

  useEffect(() => {
    loadSidebarData()
  }, [loadSidebarData])

  const handleClearFilter = () => {
    setSelectedLocation(undefined)
    setSelectedCategories([t('filters.all')])
    setSelectedSources([])
    setDateRange({})
  }

  return (
    <div className="h-screen flex flex-col">
      <CommonHeader
        title={t('header.title')}
        subtitle={t('header.subtitle')}
        showNewsButton={true}
        showSidebarButton={true}
        onToggleSidebar={() => {
          setIsSidebarOpen(!isSidebarOpen)
          if (!isSidebarOpen) {
            setIsSettingsSidebarOpen(false)
            setIsUpdatesSidebarOpen(false)
            setIsMenuSidebarOpen(false)
            setIsLoginSidebarOpen(false)
            setIsUserSidebarOpen(false)
            setIsAdminSidebarOpen(false)
          }
        }}
        onToggleLoginSidebar={() => {
          setIsLoginSidebarOpen(!isLoginSidebarOpen)
          if (!isLoginSidebarOpen) {
            setIsSidebarOpen(false)
            setIsSettingsSidebarOpen(false)
            setIsUpdatesSidebarOpen(false)
            setIsMenuSidebarOpen(false)
            setIsUserSidebarOpen(false)
            setIsAdminSidebarOpen(false)
          }
        }}
        onToggleUserSidebar={() => {
          setIsUserSidebarOpen(!isUserSidebarOpen)
          if (!isUserSidebarOpen) {
            setIsSidebarOpen(false)
            setIsSettingsSidebarOpen(false)
            setIsUpdatesSidebarOpen(false)
            setIsMenuSidebarOpen(false)
            setIsLoginSidebarOpen(false)
            setIsAdminSidebarOpen(false)
          }
        }}
        isSidebarOpen={isSidebarOpen}
        isLoginSidebarOpen={isLoginSidebarOpen}
        isUserSidebarOpen={isUserSidebarOpen}
      />

      <main className="flex-1 overflow-hidden relative">
        <div
          className={`h-full w-full transition-all duration-500 ease-out ${
            isSidebarOpen ||
            isSettingsSidebarOpen ||
            isUpdatesSidebarOpen ||
            isMenuSidebarOpen ||
            isLoginSidebarOpen ||
            isUserSidebarOpen ||
            isAdminSidebarOpen
              ? 'pr-0 md:pr-[400px]'
              : 'pr-0'
          }`}
        >
          {children}
        </div>

        {/* News Sidebar */}

        <div
          className={`absolute top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl md:border-l overflow-hidden transition-transform duration-500 ease-out z-[10001] ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <NewsSidebar
            news={news.map((item: NewsItem, index: number) => ({
              id: index + 1,
              title: item.title,
              content: item.content,
              location_name: item.location_name || '',
              latitude: item.latitude || 0,
              longitude: item.longitude || 0,
              category:
                typeof item.category === 'string'
                  ? item.category
                  : item.category?.name || '',
              published_at: item.published_at || '',
              source: item.source,
              image_url: item.image_url,
              external_url: item.external_url,
            }))}
            locations={locations}
            selectedLocation={selectedLocation}
            selectedCategory={
              selectedCategories.includes(t('filters.all'))
                ? t('filters.all')
                : selectedCategories.join(', ')
            }
            selectedSource={selectedSources.join(', ')}
            dateRange={dateRange}
            viewType={viewType}
            onLocationSelect={setSelectedLocation}
            onCategorySelect={category => {
              if (category === t('filters.all')) {
                setSelectedCategories([t('filters.all')])
              } else {
                setSelectedCategories(prev => {
                  const newCategories = prev.filter(c => c !== t('filters.all'))
                  if (newCategories.includes(category)) {
                    const filtered = newCategories.filter(c => c !== category)
                    return filtered.length > 0 ? filtered : [t('filters.all')]
                  } else {
                    return [...newCategories, category]
                  }
                })
              }
            }}
            onSourceSelect={source => {
              setSelectedSources(prev => {
                if (prev.includes(source)) {
                  return prev.filter(s => s !== source)
                } else {
                  return [...prev, source]
                }
              })
            }}
            onDateRangeChange={(start, end) => setDateRange({start, end})}
            onViewTypeChange={setViewType}
            onClearFilter={handleClearFilter}
            onClose={() => setIsSidebarOpen(false)}
            onLoadMore={() => loadSidebarData(true)}
            hasMore={hasMore}
            loadingMore={loadingMore}
          />
        </div>

        {/* Settings Sidebar */}
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-full md:w-[400px] shadow-2xl md:border-l overflow-hidden transition-transform duration-500 ease-out z-[10001]',
            '[background-color:var(--color-theme-surface-primary)] [border-color:var(--color-theme-border-primary)]',
            isSettingsSidebarOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="h-full flex flex-col [background-color:var(--color-theme-surface-primary)]">
            {/* Settings Header */}
            <SidebarHeader
              icon={<span>⚙️</span>}
              title={t('settings.title')}
              onClose={() => setIsSettingsSidebarOpen(false)}
            />

            {/* Settings Content */}
            <div className="flex-1 p-4 space-y-6">
              {/* Map Icons Setting */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2 [color:var(--color-theme-text-primary)]">
                  🗺️ {t('settings.mapIcons.title')}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setUseCustomIcons(false)}
                    className={cn(
                      'text-left w-full p-3 rounded-lg border transition-colors cursor-pointer hover:bg-[var(--color-theme-primary-50)] hover:border-[var(--color-theme-primary-200)] hover:text-[var(--color-theme-primary-900)]',
                      !useCustomIcons &&
                        'bg-[var(--color-theme-primary-50)] border-[var(--color-theme-primary-200)] text-[var(--color-theme-primary-900)]',
                    )}
                  >
                    <div className="font-medium">
                      {t('settings.mapIcons.default')}
                    </div>
                    <div className="text-xs opacity-75">
                      {t('settings.mapIcons.defaultDesc')}
                    </div>
                  </button>
                  <button
                    onClick={() => setUseCustomIcons(true)}
                    className={cn(
                      'text-left w-full p-3 rounded-lg border transition-colors cursor-pointer hover:bg-[var(--color-theme-primary-50)] hover:border-[var(--color-theme-primary-200)] hover:text-[var(--color-theme-primary-900)]',
                      useCustomIcons &&
                        'bg-[var(--color-theme-primary-50)] border-[var(--color-theme-primary-200)] text-[var(--color-theme-primary-900)]',
                    )}
                  >
                    <div className="font-medium">
                      {t('settings.mapIcons.custom')}
                    </div>
                    <div className="text-xs opacity-75">
                      {t('settings.mapIcons.customDesc')}
                    </div>
                  </button>
                </div>
              </div>

              {/* Language Setting */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2 [color:var(--color-theme-text-primary)]">
                  🌐 {t('settings.language.title')}
                </h3>
                <div className="py-3 rounded-lg border [background-color:var(--color-theme-surface-secondary)] [border-color:var(--color-theme-border-primary)]">
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Theme Setting */}

              <ThemeSwitcher variant="preview" />
            </div>
          </div>
        </div>

        {/* Updates Sidebar */}
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-full md:w-[400px] shadow-2xl md:border-l overflow-hidden transition-transform duration-500 ease-out z-[10001]',
            '[background-color:var(--color-theme-surface-primary)] [border-color:var(--color-theme-border-primary)]',
            isUpdatesSidebarOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <UpdatesSidebar onClose={() => setIsUpdatesSidebarOpen(false)} />
        </div>

        {/* Menu Sidebar (Mobile only) */}
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-full md:w-[400px] shadow-2xl md:border-l overflow-hidden transition-transform duration-500 ease-out z-[10001]',
            '[background-color:var(--color-theme-surface-primary)] [border-color:var(--color-theme-border-primary)]',
            isMenuSidebarOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <MenuSidebar
            onClose={() => setIsMenuSidebarOpen(false)}
            showNewsButton={true}
          />
        </div>

        {/* Login Sidebar */}
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-full md:w-[400px] shadow-2xl md:border-l overflow-hidden transition-transform duration-500 ease-out z-[10001]',
            '[background-color:var(--color-theme-surface-primary)] [border-color:var(--color-theme-border-primary)]',
            isLoginSidebarOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <LoginSidebar
            isOpen={isLoginSidebarOpen}
            onClose={() => setIsLoginSidebarOpen(false)}
          />
        </div>

        {/* User Sidebar */}
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-full md:w-[400px] shadow-2xl md:border-l overflow-hidden transition-transform duration-500 ease-out z-[10001]',
            '[background-color:var(--color-theme-surface-primary)] [border-color:var(--color-theme-border-primary)]',
            isUserSidebarOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <UserSidebar
            isOpen={isUserSidebarOpen}
            onClose={() => setIsUserSidebarOpen(false)}
          />
        </div>

        {/* Admin Sidebar */}
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-full md:w-[400px] shadow-2xl md:border-l overflow-hidden transition-transform duration-500 ease-out z-[10001]',
            '[background-color:var(--color-theme-surface-primary)] [border-color:var(--color-theme-border-primary)]',
            isAdminSidebarOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <AdminSidebar
            isOpen={isAdminSidebarOpen}
            onClose={() => setIsAdminSidebarOpen(false)}
          />
        </div>
      </main>
    </div>
  )
}

export default function MainLayout({children}: MainLayoutProps) {
  return (
    <MainLayoutProvider>
      <MainLayoutInner>{children}</MainLayoutInner>
    </MainLayoutProvider>
  )
}
