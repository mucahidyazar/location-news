'use client'

import {useState, useEffect, useCallback} from 'react'
import CommonHeader from '@/components/common-header'
import NewsSidebar from '@/components/news-sidebar'
import UpdatesSidebar from '@/components/updates-sidebar'
import MenuSidebar from '@/components/menu-sidebar'
import {useTranslations} from 'next-intl'
import {MainLayoutProvider, useMainLayout} from '@/contexts/main-layout-context'
import {NewsItem, Location} from '@/lib/types'

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
  const [weeksLoaded, setWeeksLoaded] = useState(1)

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

        const currentWeeks = loadMore ? weeksLoaded + 1 : 1

        // Calculate date range for the current weeks
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(endDate.getDate() - currentWeeks * 7)

        const params = new URLSearchParams({
          limit: '500',
          offset: '0',
          start_date: startDate.toISOString().split('T')[0] + 'T00:00',
          end_date: endDate.toISOString().split('T')[0] + 'T23:59',
        })

        const promises = [fetch(`/api/news?${params.toString()}`)]

        if (!loadMore) {
          promises.push(fetch('/api/locations'))
        }

        const responses = await Promise.all(promises)
        const newsData = await responses[0].json()

        if (loadMore) {
          setNews(newsData) // Replace all data with extended date range
          setWeeksLoaded(currentWeeks)
        } else {
          setNews(newsData)
          setWeeksLoaded(1)

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
                newsCount: item.news_count,
                primaryCategory: item.primary_category,
              }),
            )
            setLocations(transformedLocations)
          }
        }

        setHasMore(currentWeeks < 12) // Limit to 12 weeks
      } catch (error) {
        console.error('Error loading sidebar data:', error)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [weeksLoaded],
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
              imageUrl: item.image_url,
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
          className={`absolute top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl md:border-l overflow-hidden transition-transform duration-500 ease-out z-[10001] ${
            isSettingsSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col bg-white">
            {/* Settings Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span>⚙️</span>
                {t('settings.title')}
              </h2>
              <button
                onClick={() => setIsSettingsSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>

            {/* Settings Content */}
            <div className="flex-1 p-4 space-y-6">
              {/* Map Icons Setting */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  🗺️ {t('settings.mapIcons.title')}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setUseCustomIcons(false)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      !useCustomIcons
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                    }`}
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
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      useCustomIcons
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                    }`}
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
                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  🌐 {t('settings.language.title')}
                </h3>
                <div className="p-3 rounded-lg border bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Language switcher will be here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Updates Sidebar */}
        <div
          className={`absolute top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl md:border-l overflow-hidden transition-transform duration-500 ease-out z-[10001] ${
            isUpdatesSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <UpdatesSidebar onClose={() => setIsUpdatesSidebarOpen(false)} />
        </div>

        {/* Menu Sidebar (Mobile only) */}
        <div
          className={`absolute top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl md:border-l overflow-hidden transition-transform duration-500 ease-out z-[10001] ${
            isMenuSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
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
