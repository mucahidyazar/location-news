'use client'

import {useState, useEffect} from 'react'
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

export default function HomePage() {
  const t = useTranslations()
  const {useCustomIcons} = useMainLayout()

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
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
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

    if (searchTerm) {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

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
    searchTerm,
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

  const loadData = async () => {
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
    <div className="h-full w-full relative">
      {/* Floating Filters Panel */}
      <div className="absolute top-4 left-2 right-2 md:left-4 md:right-4 z-[9999] bg-white/65 hover:bg-white/85 transition-all duration-300 backdrop-blur-sm rounded-lg p-2 md:p-4 shadow-lg space-y-2 md:space-y-4">
        {/* Search and Main Filters */}
        <div className="flex gap-2 md:gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[150px] md:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search city, news title, or any keyword"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 h-8 text-sm bg-white"
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
        <div className="max-h-20 md:max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="flex flex-wrap gap-1 md:gap-2">
            {uniqueSources.map(source => {
              const IconComponent = getSourceIcon(source)
              const sourceNewsCount = sourceCount[source] || 0
              return (
                <button
                  key={source}
                  onClick={() => handleSourceSelect(source)}
                  className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg transition-all hover:bg-blue-100 ${
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
        />
      </div>
    </div>
  )
}
