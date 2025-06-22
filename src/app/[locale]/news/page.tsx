'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Newspaper, Search, X, Star, MapPin, Calendar, Eye } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

interface NewsItem {
  id: string
  title: string
  content: string
  summary: string | null
  published_at: string
  is_featured: boolean
  view_count: number
  image_url: string | null
  externalUrl: string | null
  location: {
    id: string
    name: string
    latitude: number
    longitude: number
    country: string | null
    region: string | null
  } | null
  category: {
    id: string
    name: string
    color: string
  } | null
  source: {
    id: string
    name: string
    url: string | null
  } | null
}

interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  country: string | null
  region: string | null
  news_count: number
}

interface Category {
  id: string
  name: string
  color: string
}

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

  const filterNews = useCallback(() => {
    let filtered = news

    if (searchTerm) {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedLocation) {
      filtered = filtered.filter(item => item.location?.name === selectedLocation)
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category?.name === selectedCategory)
    }

    if (featuredOnly) {
      filtered = filtered.filter(item => item.is_featured)
    }

    setFilteredNews(filtered)
  }, [news, searchTerm, selectedLocation, selectedCategory, featuredOnly])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterNews()
  }, [filterNews])

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

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedLocation('')
    setSelectedCategory('')
    setFeaturedOnly(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Az önce'
    if (diffInHours < 24) return `${diffInHours} saat önce`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} gün önce`
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Newspaper className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">LocationNews</h1>
            </Link>
            <div className="text-sm text-gray-500">
              {filteredNews.length} haber bulundu
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Tüm Şehirler</option>
              {locations.map(location => (
                <option key={location.id} value={location.name}>
                  {location.name} ({location.news_count})
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Featured Toggle */}
            <Button
              variant={featuredOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className="flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Öne Çıkanlar
            </Button>

            {/* Clear Filters */}
            {(searchTerm || selectedLocation || selectedCategory || featuredOnly) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                {t('common.clear')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map(item => (
            <article key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {item.image_url && (
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  {item.is_featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                  {item.category && (
                    <Badge
                      style={{
                        backgroundColor: item.category.color,
                        color: 'white'
                      }}
                      className="text-xs"
                    >
                      {item.category.name}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h2 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h2>

                {/* Summary */}
                {item.summary && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.summary}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    {item.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location.name}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.published_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.view_count}
                    </div>
                  </div>
                </div>

                {/* Source */}
                {item.source && (
                  <div className="text-xs text-gray-400">
                    {t('news.source')}: {item.externalUrl ? (
                      <a 
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600 hover:underline transition-colors"
                      >
                        {item.source.name}
                      </a>
                    ) : (
                      <span>{item.source.name}</span>
                    )}
                  </div>
                )}

                {/* Read More */}
                {item.externalUrl && (
                  <div className="mt-4">
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Devamını oku →
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Haber bulunamadı</h3>
            <p className="mt-2 text-gray-600">
              Arama kriterlerinizi değiştirip tekrar deneyin.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}