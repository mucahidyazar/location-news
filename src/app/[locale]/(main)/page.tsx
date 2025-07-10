'use client'

import {useState, useEffect, useCallback} from 'react'
import InteractiveMap from '@/components/interactive-map'
import {NewsItem, Location} from '@/lib/types'
import {useMainLayout} from '@/contexts/main-layout-context'
import {
  categoryKeys,
  getCategoryColor,
  getCategoryKeyByName,
  getCategoryColorByKey,
} from '@/lib/category-colors'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Newspaper, Search, X, Globe, Tv, Building} from 'lucide-react'
import SmartDatePicker from '@/components/smart-date-picker'
import {useTranslations} from 'next-intl'
import {LogoLoading} from '@/components/ui/logo-loading'
import {FloatingReportButton} from '@/components/floating-report-button'
import {FloatingMenuButton} from '@/components/floating-menu-button'
import {NewsReportForm} from '@/components/news-report-form'
import {cn} from '@/lib/utils'
import {useAuth} from '@/contexts/auth-context'
import ArcGISGlobeLoading from '@/components/arcgis-globe-loading'

export default function HomePage() {
  const t = useTranslations()
  const {loading: authLoading, isAdmin} = useAuth()
  const {
    useCustomIcons,
    isSidebarOpen,
    setIsSidebarOpen,
    isSettingsSidebarOpen,
    setIsSettingsSidebarOpen,
    isUpdatesSidebarOpen,
    setIsUpdatesSidebarOpen,
    isAdminSidebarOpen,
    setIsAdminSidebarOpen,
    isMenuSidebarOpen,
    isUserSidebarOpen,
  } = useMainLayout()

  // Check if any sidebar is open
  const isAnySidebarOpen =
    isSidebarOpen ||
    isSettingsSidebarOpen ||
    isUpdatesSidebarOpen ||
    isMenuSidebarOpen ||
    isAdminSidebarOpen ||
    isUserSidebarOpen

  // Generate dynamic categories based on translations
  const getLocalizedCategories = () => {
    return categoryKeys.map(key => {
      if (key === 'all') return t('filters.all')
      return t(`categories.${key}`)
    })
  }

  const [news, setNews] = useState<NewsItem[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    t('filters.all'),
  ])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{start?: string; end?: string}>({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setViewType] = useState<'card' | 'horizontal' | 'minimal'>('card')
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  // Input için local state (focus problemi çözülür)
  const [inputValue, setInputValue] = useState('')
  // API call için debounced search term
  const [, setDebouncedSearchTerm] = useState('')
  const [isReportFormOpen, setIsReportFormOpen] = useState(false)
  const [selectedMapCoordinates, setSelectedMapCoordinates] = useState<{
    lat: number
    lng: number
  } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  // inputValue değiştiğinde 500ms sonra debouncedSearchTerm'i güncelle ve API call yap
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      setDebouncedSearchTerm(inputValue)
      // API call yap
      await loadData(inputValue)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [inputValue])

  // Listen for news approval events to refresh data
  useEffect(() => {
    const handleNewsApproved = () => {
      loadData()
    }

    window.addEventListener('newsApproved', handleNewsApproved)
    return () => window.removeEventListener('newsApproved', handleNewsApproved)
  }, [])

  useEffect(() => {
    let filtered = news

    if (selectedLocation) {
      filtered = filtered.filter(
        item => item.location_name === selectedLocation,
      )
    }

    if (
      !selectedCategories.includes(t('filters.all')) &&
      selectedCategories.length > 0
    ) {
      filtered = filtered.filter(item =>
        selectedCategories.includes(
          typeof item.category === 'string'
            ? item.category
            : item.category?.name || '',
        ),
      )
    }

    if (selectedSources.length > 0) {
      filtered = filtered.filter(item =>
        selectedSources.includes(
          typeof item.source === 'string'
            ? item.source
            : item.source?.name || '',
        ),
      )
    }

    // Search filtering artık API'de yapılıyor, client-side filtering kaldırıldı

    if (dateRange.start) {
      filtered = filtered.filter(
        item =>
          item.created_at &&
          new Date(item.created_at) >= new Date(dateRange.start!),
      )
    }

    if (dateRange.end) {
      filtered = filtered.filter(
        item =>
          item.created_at &&
          new Date(item.created_at) <= new Date(dateRange.end!),
      )
    }

    setFilteredNews(filtered)
  }, [
    selectedLocation,
    selectedCategories,
    selectedSources,
    dateRange,
    news,
    t, // Added missing dependency
  ])

  // Get unique sources from news, sorted by news count (descending)
  const sourceCount = news.reduce((acc, item) => {
    const sourceName =
      typeof item.source === 'string' ? item.source : item.source?.name || ''
    acc[sourceName] = (acc[sourceName] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const uniqueSources = Array.from(
    new Set(
      news
        .map(item =>
          typeof item.source === 'string'
            ? item.source
            : item.source?.name || '',
        )
        .filter(Boolean),
    ),
  ).sort((a, b) => (sourceCount[b] || 0) - (sourceCount[a] || 0))

  const getSourceIcon = (source: string) => {
    if (source.toLowerCase().includes('haber')) return Newspaper
    if (
      source.toLowerCase().includes('tv') ||
      source.toLowerCase().includes('medya')
    )
      return Tv
    if (
      source.toLowerCase().includes('tech') ||
      source.toLowerCase().includes('teknoloji')
    )
      return Building
    return Globe
  }

  const loadData = async (searchTerm?: string) => {
    try {
      // Load last month's data by default
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - 30)

      const params = new URLSearchParams({
        start_date: startDate.toISOString().split('T')[0] + 'T00:00',
        end_date: endDate.toISOString().split('T')[0] + 'T23:59',
        limit: '500',
      })

      // Search parametresini ekle
      if (searchTerm && searchTerm.trim()) {
        params.append('search', searchTerm.trim())
      }

      // Load data from Supabase APIs
      const [newsResponse, locationsResponse] = await Promise.all([
        fetch(`/api/news?${params.toString()}`),
        fetch('/api/locations'),
      ])

      const newsData = await newsResponse.json()
      const locationsData = await locationsResponse.json()

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

      setNews(newsData)
      setLocations(transformedLocations)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)
  }

  const handleClearFilter = () => {
    setSelectedLocation(undefined)
    setSelectedCategories([t('filters.all')])
    setSelectedSources([])
    setDateRange({})
    setInputValue('')
    setDebouncedSearchTerm('')
  }

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    },
    [],
  )

  const handleCategorySelect = (category: string) => {
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
  }

  const handleSourceSelect = (source: string) => {
    setSelectedSources(prev => {
      if (prev.includes(source)) {
        return prev.filter(s => s !== source)
      } else {
        return [...prev, source]
      }
    })
  }

  const handleDateRangeChange = (start?: string, end?: string) => {
    setDateRange({start, end})
  }

  const handleNewsReport = async (reportData: unknown) => {
    try {
      const response = await fetch('/api/news-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit news report')
      }

      // Show success message (could be improved with a toast notification)
      alert(
        'Haber başarıyla gönderildi! Admin onayından sonra yayınlanacaktır.',
      )

      // Optionally reload data to show the new pending news
      // loadData()
    } catch (error) {
      console.error('Error submitting news report:', error)
      throw error
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedMapCoordinates({lat, lng})
  }

  // Floating menu handlers
  const handleModerateClick = () => {
    setIsAdminSidebarOpen(true)
    setIsSidebarOpen(false)
    setIsSettingsSidebarOpen(false)
    setIsUpdatesSidebarOpen(false)
  }

  const handleUpdatesClick = () => {
    setIsUpdatesSidebarOpen(true)
    setIsSidebarOpen(false)
    setIsSettingsSidebarOpen(false)
    setIsAdminSidebarOpen(false)
  }

  const handleSettingsClick = () => {
    setIsSettingsSidebarOpen(true)
    setIsSidebarOpen(false)
    setIsUpdatesSidebarOpen(false)
    setIsAdminSidebarOpen(false)
  }

  const handleFeedClick = () => {
    setIsSidebarOpen(true)
    setIsSettingsSidebarOpen(false)
    setIsUpdatesSidebarOpen(false)
    setIsAdminSidebarOpen(false)
  }

  if (loading || authLoading) {
    return (
      <LogoLoading
        variant="page"
        text={t('common.loading')}
        showText={false}
        size="xl"
      />
    )
  }

  return (
    <div className="h-full w-full relative">
      {/* Floating Filters Panel */}
      <div className="absolute top-4 left-2 right-2 md:left-4 md:right-4 z-[9999] transition-all duration-300 backdrop-blur-sm rounded-lg p-2 md:p-4 shadow-lg space-y-2 md:space-y-4 opacity-85 hover:opacity-95 bg-[var(--color-theme-surface-primary)]">
        {/* Search and Main Filters */}
        <div className="flex gap-2 md:gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[150px] md:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search city, news title, or any keyword"
              value={inputValue}
              onChange={handleInputChange}
              className="pl-10 h-8 text-sm"
            />
          </div>

          <SmartDatePicker
            onDateRangeChange={handleDateRangeChange}
            className="w-full md:w-[320px]"
            defaultToLastWeek={true}
          />
          {(selectedLocation ||
            !selectedCategories.includes(t('filters.all')) ||
            selectedSources.length > 0 ||
            inputValue ||
            dateRange?.start ||
            dateRange?.end) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilter}
              className="text-red-600 hover:text-red-800 hover:bg-red-50 h-8 px-2 text-xs cursor-pointer mx-auto"
            >
              <X className="w-3 h-3 mr-1" />
              {t('common.clear')}
            </Button>
          )}
        </div>

        {/* News Sources Filter */}
        <div className="max-h-20 md:max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="flex flex-wrap gap-1 md:gap-2">
            {uniqueSources.map(source => {
              const IconComponent = getSourceIcon(source)
              const sourceNewsCount = sourceCount[source] || 0
              return (
                <button
                  key={source}
                  onClick={() => handleSourceSelect(source)}
                  className={cn(
                    'flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg transition-all border-2',
                    selectedSources.includes(source)
                      ? 'shadow-sm border-[var(--color-theme-primary-300)] bg-[var(--color-theme-primary-50)] text-[var(--color-theme-primary-600)]'
                      : 'border-transparent bg-[var(--color-theme-surface-secondary)] text-[var(--color-theme-text-primary)] hover:bg-[var(--color-theme-surface-tertiary)]',
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">{source}</span>
                    <span className="text-xs opacity-75">
                      {sourceNewsCount} haber
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Category Filter Badges */}
        <div className="flex flex-wrap gap-1 md:gap-2">
          {getLocalizedCategories().map(category => {
            const isSelected = selectedCategories.includes(category)
            // Use key-based system for better multilingual support
            const categoryKey =
              category === t('filters.all')
                ? 'other_incidents'
                : getCategoryKeyByName(category)
            const categoryStyle =
              category === t('filters.all')
                ? getCategoryColor(category)
                : getCategoryColorByKey(categoryKey)
            const categoryNewsCount =
              category === t('filters.all')
                ? news.length
                : news.filter(
                    item =>
                      (typeof item.category === 'string'
                        ? item.category
                        : item.category?.name) === category,
                  ).length

            return (
              <Badge
                key={category}
                variant="secondary"
                className={`cursor-pointer transition-all duration-200 text-xs flex items-center gap-1 ${
                  isSelected
                    ? `${categoryStyle.badge} opacity-100`
                    : `bg-opacity-20 hover:bg-opacity-40 opacity-70 hover:opacity-100`
                } border border-opacity-30`}
                style={{
                  backgroundColor: isSelected
                    ? undefined
                    : `${categoryStyle.hex}20`,
                  borderColor: categoryStyle.hex,
                  color: categoryStyle.hex,
                }}
                onClick={() => handleCategorySelect(category)}
              >
                <span>{category}</span>
                <span className="text-xs opacity-60">
                  ({categoryNewsCount})
                </span>
              </Badge>
            )
          })}
        </div>
      </div>

      <div className="absolute inset-0">
        <InteractiveMap
          locations={locations}
          filteredNews={filteredNews.map((item: NewsItem, index: number) => ({
            id: index + 1,
            title: item.title,
            content: item.content,
            location: item.location_name || '',
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
          selectedLocation={selectedLocation}
          selectedCategory={
            selectedCategories.includes(t('filters.all'))
              ? t('filters.all')
              : selectedCategories[0]
          }
          onLocationSelect={handleLocationSelect}
          useCustomIcons={useCustomIcons}
          onMapClick={handleMapClick}
          isReportMode={isReportFormOpen}
        />
      </div>

      {/* Floating Menu Button */}
      <FloatingMenuButton
        onModerateClick={handleModerateClick}
        onUpdatesClick={handleUpdatesClick}
        onSettingsClick={handleSettingsClick}
        onFeedClick={handleFeedClick}
        isSidebarOpen={isAnySidebarOpen}
        isAdmin={isAdmin}
      />

      {/* Floating Report Button */}
      <FloatingReportButton
        onClick={() => setIsReportFormOpen(!isReportFormOpen)}
        isFormOpen={isReportFormOpen}
        isSidebarOpen={isAnySidebarOpen}
      />

      {/* News Report Form */}
      <NewsReportForm
        isOpen={isReportFormOpen}
        onClose={() => setIsReportFormOpen(false)}
        onSubmit={handleNewsReport}
        isSidebarOpen={isAnySidebarOpen}
        selectedCoordinates={selectedMapCoordinates}
      />
    </div>
  )
}
