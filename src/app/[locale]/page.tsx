'use client'

import {useState, useEffect} from 'react'
import InteractiveMap from '@/components/interactive-map'
import NewsSidebar from '@/components/news-sidebar'
import {NewsItem, Location} from '@/lib/database'
import {
  categoryKeys,
  getCategoryColor,
  getCategoryKeyByName,
  getCategoryColorByKey,
} from '@/lib/category-colors'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {
  Newspaper,
  Search,
  X,
  Globe,
  Tv,
  Building,
  Grid3x3,
  List,
  MapPin,
  Settings,
} from 'lucide-react'
import {Link} from '@/i18n/routing'
import SmartDatePicker from '@/components/smart-date-picker'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import {useTranslations} from 'next-intl'

export default function HomePage() {
  const t = useTranslations()

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
  const [viewType, setViewType] = useState<'card' | 'horizontal' | 'minimal'>(
    'card',
  )
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [useCustomIcons, setUseCustomIcons] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = news

    if (selectedLocation) {
      filtered = filtered.filter(item => item.location === selectedLocation)
    }

    if (
      !selectedCategories.includes(t('filters.all')) &&
      selectedCategories.length > 0
    ) {
      filtered = filtered.filter(item =>
        selectedCategories.includes(item.category),
      )
    }

    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => selectedSources.includes(item.source))
    }

    if (searchTerm) {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (dateRange.start) {
      filtered = filtered.filter(
        item => new Date(item.publishedAt) >= new Date(dateRange.start!),
      )
    }

    if (dateRange.end) {
      filtered = filtered.filter(
        item => new Date(item.publishedAt) <= new Date(dateRange.end!),
      )
    }

    setFilteredNews(filtered)
  }, [
    selectedLocation,
    selectedCategories,
    selectedSources,
    dateRange,
    searchTerm,
    news,
    t, // Added missing dependency
  ])

  // Get unique sources from news, sorted by news count (descending)
  const sourceCount = news.reduce((acc, item) => {
    acc[item.source] = (acc[item.source] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const uniqueSources = Array.from(new Set(news.map(item => item.source))).sort(
    (a, b) => (sourceCount[b] || 0) - (sourceCount[a] || 0),
  )

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

  const loadData = async () => {
    try {
      // Load data from Supabase APIs
      const [newsResponse, locationsResponse] = await Promise.all([
        fetch('/api/news'),
        fetch('/api/locations'),
      ])

      const newsData = await newsResponse.json()
      const locationsData = await locationsResponse.json()

      // Transform Supabase data to legacy format
      const transformedNews: NewsItem[] = newsData.map(
        (item: {
          title: string;
          content: string;
          location?: { name: string; latitude: number; longitude: number };
          category?: { name: string };
          published_at: string;
          source?: { name: string };
          image_url?: string;
          external_url?: string;
        }, index: number) => ({
          id: index + 1,
          title: item.title,
          content: item.content,
          location: item.location?.name || '',
          latitude: item.location?.latitude || 0,
          longitude: item.location?.longitude || 0,
          category: item.category?.name || '',
          publishedAt: item.published_at,
          source: item.source?.name || '',
          imageUrl: item.image_url,
          externalUrl: item.external_url,
        }),
      )

      const transformedLocations: Location[] = locationsData.map(
        (item: {
          name: string;
          latitude: number;
          longitude: number;
          news_count: number;
          primary_category: string;
        }, index: number) => ({
          id: index + 1,
          name: item.name,
          latitude: item.latitude,
          longitude: item.longitude,
          newsCount: item.news_count,
          primaryCategory: item.primary_category,
        }),
      )

      setNews(transformedNews)
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
    setSearchTerm('')
  }

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

  const handleViewTypeChange = (
    newViewType: 'card' | 'horizontal' | 'minimal',
  ) => {
    setViewType(newViewType)
  }

  const handleToggleIcons = () => {
    setUseCustomIcons(!useCustomIcons)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b px-4 lg:px-6 py-3 z-[100]">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Newspaper className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                {t('header.title')}
              </h1>
              <p className="text-xs text-gray-600 hidden lg:block">
                {t('header.subtitle')}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={handleToggleIcons}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title={
                useCustomIcons ? t('map.simpleIcons') : t('map.customIcons')
              }
            >
              {useCustomIcons ? (
                <MapPin className="w-5 h-5 text-gray-600" />
              ) : (
                <Settings className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.href = '/news'}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title={t('navigation.news')}
              >
                <Grid3x3 className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title={t('common.more')}
              >
                <List className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="flex-1 h-64 lg:h-full flex flex-col relative">
          {/* Floating Filters Panel */}
          <div className="absolute top-4 left-4 right-4 z-[1000] bg-white/60 hover:bg-white/90 transition-all duration-200 backdrop-blur-sm rounded-lg p-4 shadow-lg space-y-4">
            {/* Search and Main Filters */}
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t('common.search')}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 h-8 text-sm"
                />
              </div>

              <SmartDatePicker
                onDateRangeChange={handleDateRangeChange}
                className="min-w-[240px]"
              />

              {(selectedLocation ||
                !selectedCategories.includes(t('filters.all')) ||
                selectedSources.length > 0 ||
                searchTerm ||
                dateRange?.start ||
                dateRange?.end) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilter}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-8 px-2 text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  {t('common.clear')}
                </Button>
              )}
            </div>

            {/* News Sources Filter */}
            <div className="max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="flex flex-wrap gap-2">
                {uniqueSources.map(source => {
                  const IconComponent = getSourceIcon(source)
                  const sourceNewsCount = sourceCount[source] || 0
                  return (
                    <button
                      key={source}
                      onClick={() => handleSourceSelect(source)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-blue-100 ${
                        selectedSources.includes(source)
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                      }`}
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
            <div className="flex flex-wrap gap-2">
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
                    : news.filter(item => item.category === category).length

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

          <div className="flex-1">
            <InteractiveMap
              locations={locations}
              filteredNews={filteredNews}
              selectedLocation={selectedLocation}
              selectedCategory={
                selectedCategories.includes(t('filters.all'))
                  ? t('filters.all')
                  : selectedCategories[0]
              }
              onLocationSelect={handleLocationSelect}
              useCustomIcons={useCustomIcons}
              onToggleIcons={handleToggleIcons}
            />
          </div>
        </div>

        {/* Slide-out Sidebar */}
        <div
          className={`fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl transform transition-transform duration-300 z-[1000] ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <NewsSidebar
            news={filteredNews}
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
            onLocationSelect={handleLocationSelect}
            onCategorySelect={handleCategorySelect}
            onSourceSelect={handleSourceSelect}
            onDateRangeChange={handleDateRangeChange}
            onViewTypeChange={handleViewTypeChange}
            onClearFilter={handleClearFilter}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>
      </main>
    </div>
  )
}
