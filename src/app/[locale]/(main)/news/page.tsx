'use client'

import {useState, useEffect} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Newspaper, Search, X, Star} from 'lucide-react'
import NewsCard from '@/components/news-card'
import {NewsItem, Location, Category} from '@/lib/types'
import {useTranslations} from 'next-intl'

export default function NewsPage() {
  const t = useTranslations()
  const [news, setNews] = useState<NewsItem[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [featuredOnly, setFeaturedOnly] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterNews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [news, searchTerm, selectedLocation, selectedCategory, featuredOnly])

  const loadData = async () => {
    try {
      const [newsRes, locationsRes, categoriesRes] = await Promise.all([
        fetch('/api/news'),
        fetch('/api/locations'),
        fetch('/api/categories'),
      ])

      const newsData = await newsRes.json()
      const locationsData = await locationsRes.json()
      const categoriesData = await categoriesRes.json()

      setNews(newsData)
      setLocations(locationsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterNews = () => {
    let filtered = news

    if (searchTerm) {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedLocation) {
      filtered = filtered.filter(
        item => (typeof item.location === 'string' ? item.location : item.location?.name) === selectedLocation,
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        item => (typeof item.category === 'string' ? item.category : item.category?.name) === selectedCategory,
      )
    }

    if (featuredOnly) {
      filtered = filtered.filter(item => item.is_featured)
    }

    setFilteredNews(filtered)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedLocation('')
    setSelectedCategory('')
    setFeaturedOnly(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      {/* Filters */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('news.searchPlaceholder')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">{t('news.allCities')}</option>
              {locations.map(location => (
                <option key={location.id} value={location.name}>
                  {location.name} ({location.news_count})
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">{t('news.allCategories')}</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Featured Toggle */}
            <Button
              variant={featuredOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className="flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              {t('news.featured')}
            </Button>

            {/* Clear Filters */}
            {(searchTerm ||
              selectedLocation ||
              selectedCategory ||
              featuredOnly) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                {t('news.clearFilters')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map(item => (
            <NewsCard 
              key={item.id} 
              news={item}
              onLocationClick={(location) => setSelectedLocation(location)}
            />
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {t('news.noNewsFound')}
            </h3>
            <p className="mt-2 text-gray-600">
              {t('news.changeSearchCriteria')}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>{t('news.copyrightText')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}