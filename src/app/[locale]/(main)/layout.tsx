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
  } = useMainLayout()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newsLoaded, NEWS_PER_PAGE],
  )

  useEffect(() => {
    loadSidebarData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          }
        }}
        onToggleSettingsSidebar={() => {
          setIsSettingsSidebarOpen(!isSettingsSidebarOpen)
          if (!isSettingsSidebarOpen) {
            setIsSidebarOpen(false)
            setIsUpdatesSidebarOpen(false)
            setIsMenuSidebarOpen(false)
          }
        }}
        onToggleUpdatesSidebar={() => {
          setIsUpdatesSidebarOpen(!isUpdatesSidebarOpen)
          if (!isUpdatesSidebarOpen) {
            setIsSidebarOpen(false)
            setIsSettingsSidebarOpen(false)
            setIsMenuSidebarOpen(false)
          }
        }}
        onToggleMenuSidebar={() => {
          setIsMenuSidebarOpen(!isMenuSidebarOpen)
          if (!isMenuSidebarOpen) {
            setIsSidebarOpen(false)
            setIsSettingsSidebarOpen(false)
            setIsUpdatesSidebarOpen(false)
          }
        }}
        isSidebarOpen={isSidebarOpen}
        isSettingsSidebarOpen={isSettingsSidebarOpen}
        isUpdatesSidebarOpen={isUpdatesSidebarOpen}
        isMenuSidebarOpen={isMenuSidebarOpen}
      />

      <main className="flex-1 overflow-hidden relative">
        <div
          className={`h-full w-full transition-all duration-500 ease-out ${
            isSidebarOpen ||
            isSettingsSidebarOpen ||
            isUpdatesSidebarOpen ||
            isMenuSidebarOpen
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
          className={`absolute top-0 right-0 h-full w-full md:w-[400px] shadow-2xl md:border-l overflow-hidden transition-transform duration-500 ease-out z-[10001] ${
            isSettingsSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            backgroundColor: 'var(--color-theme-surface-primary)',
            borderColor: 'var(--color-theme-border-primary)',
          }}
        >
          <div
            className="h-full flex flex-col"
            style={{backgroundColor: 'var(--color-theme-surface-primary)'}}
          >
            {/* Settings Header */}
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-theme-secondary-200) 0%, var(--color-theme-secondary-300) 50%, var(--color-theme-primary-200) 100%)',
                borderColor: 'var(--color-theme-border-primary)',
              }}
            >
              <h2
                className="text-lg font-semibold flex items-center gap-2"
                style={{color: 'var(--color-theme-text-primary)'}}
              >
                <span>⚙️</span>
                {t('settings.title')}
              </h2>
              <button
                onClick={() => setIsSettingsSidebarOpen(false)}
                className="p-1 rounded transition-colors"
                style={{color: 'var(--color-theme-text-secondary)'}}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor =
                    'var(--color-theme-surface-secondary)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                ✕
              </button>
            </div>

            {/* Settings Content */}
            <div className="flex-1 p-4 space-y-6">
              {/* Map Icons Setting */}
              <div className="space-y-3">
                <h3
                  className="text-sm font-medium flex items-center gap-2"
                  style={{color: 'var(--color-theme-text-primary)'}}
                >
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
                <h3
                  className="text-sm font-medium flex items-center gap-2"
                  style={{color: 'var(--color-theme-text-primary)'}}
                >
                  🌐 {t('settings.language.title')}
                </h3>
                <div
                  className="py-3 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--color-theme-surface-secondary)',
                    borderColor: 'var(--color-theme-border-primary)',
                  }}
                >
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
          className={`absolute top-0 right-0 h-full w-full md:w-[400px] shadow-2xl md:border-l overflow-hidden transition-transform duration-500 ease-out z-[10001] ${
            isUpdatesSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            backgroundColor: 'var(--color-theme-surface-primary)',
            borderColor: 'var(--color-theme-border-primary)',
          }}
        >
          <UpdatesSidebar onClose={() => setIsUpdatesSidebarOpen(false)} />
        </div>

        {/* Menu Sidebar (Mobile only) */}
        <div
          className={`absolute top-0 right-0 h-full w-full md:w-[400px] shadow-2xl md:border-l overflow-hidden transition-transform duration-500 ease-out z-[10001] ${
            isMenuSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            backgroundColor: 'var(--color-theme-surface-primary)',
            borderColor: 'var(--color-theme-border-primary)',
          }}
        >
          <MenuSidebar
            onClose={() => setIsMenuSidebarOpen(false)}
            showNewsButton={true}
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
