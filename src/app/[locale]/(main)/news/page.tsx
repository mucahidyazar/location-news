'use client'

import {useState, useEffect} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Newspaper, Search, X} from 'lucide-react'
import NewsCard from '@/components/news-card'
import {NewsItem, Category} from '@/lib/types'
import {useTranslations} from 'next-intl'

export default function NewsPage() {
  const t = useTranslations()
  const [news, setNews] = useState<NewsItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [newsLoaded, setNewsLoaded] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const NEWS_PER_PAGE = 20

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setNewsLoaded(0)
    setNews([])
    setHasMore(true)
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory])

  useEffect(() => {
    filterNews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [news])

  const loadData = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const currentOffset = loadMore ? newsLoaded : 0
      const currentLimit = NEWS_PER_PAGE
      
      const params = new URLSearchParams({
        limit: currentLimit.toString(),
        offset: currentOffset.toString(),
      })

      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)

      const promises = [
        fetch(`/api/news?${params.toString()}`),
      ]

      if (!loadMore) {
        promises.push(
          fetch('/api/categories')
        )
      }

      const responses = await Promise.all(promises)
      const newsData = await responses[0].json()

      if (loadMore) {
        setNews(prev => [...prev, ...newsData]) // Append new news
        setNewsLoaded(prev => prev + newsData.length)
      } else {
        setNews(newsData)
        setNewsLoaded(newsData.length)
        
        if (responses.length > 1) {
          const categoriesData = await responses[1].json()
          setCategories(categoriesData)
        }
      }

      // Check if there are more news to load (if we got less than requested, no more)
      setHasMore(newsData.length === NEWS_PER_PAGE)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const filterNews = () => {
    setFilteredNews(news)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--color-theme-primary-600)' }}></div>
          <p style={{ color: 'var(--color-theme-text-secondary)' }}>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto" style={{ backgroundColor: 'var(--color-theme-surface-primary)' }}>
      {/* Filters */}
      <div className="shadow-sm" style={{ backgroundColor: 'var(--color-theme-surface-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search city, news title, or any keyword"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>


            {/* Category Filter */}
            <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('news.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('news.allCategories')}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


            {/* Clear Filters */}
            {(searchTerm ||
              selectedCategory) && (
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map(item => (
            <NewsCard 
              key={item.id} 
              news={item}
              onLocationClick={() => {}}
            />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && filteredNews.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => loadData(true)}
              disabled={loadingMore}
              className="px-8 py-2"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('common.loading')}
                </>
              ) : (
                t('news.loadMore')
              )}
            </Button>
          </div>
        )}

        {filteredNews.length === 0 && !loading && (
          <div className="text-center py-12">
            <Newspaper className="mx-auto h-12 w-12" style={{ color: 'var(--color-theme-text-tertiary)' }} />
            <h3 className="mt-4 text-lg font-medium" style={{ color: 'var(--color-theme-text-primary)' }}>
              {t('news.noNewsFound')}
            </h3>
            <p className="mt-2" style={{ color: 'var(--color-theme-text-secondary)' }}>
              {t('news.changeSearchCriteria')}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12" style={{ backgroundColor: 'var(--color-theme-surface-secondary)', borderColor: 'var(--color-theme-border-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center" style={{ color: 'var(--color-theme-text-tertiary)' }}>
            <p>{t('news.copyrightText')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}