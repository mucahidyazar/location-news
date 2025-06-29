'use client'

import React from 'react'
import {NewsItem} from '@/lib/types'
import NewsCard from './news-card'
import NewsCardHorizontal from './news-card-horizontal'
import NewsCardMinimal from './news-card-minimal'
import {X, Grid3X3, LayoutList, AlignLeft, Newspaper} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {useTranslations} from 'next-intl'

interface NewsSidebarProps {
  news: NewsItem[]
  locations: {length: number}
  selectedLocation?: string
  selectedCategory?: string
  selectedSource?: string
  dateRange?: {start?: string; end?: string}
  viewType: 'card' | 'horizontal' | 'minimal'
  onLocationSelect: (location: string) => void
  onCategorySelect?: (category: string) => void
  onSourceSelect?: (source: string) => void
  onDateRangeChange?: (start?: string, end?: string) => void
  onViewTypeChange: (viewType: 'card' | 'horizontal' | 'minimal') => void
  onClearFilter?: () => void
  onClose?: () => void
  onLoadMore?: () => void
  hasMore?: boolean
  loadingMore?: boolean
}

export default function NewsSidebar({
  news,
  locations,
  viewType,
  onLocationSelect,
  onViewTypeChange,
  onClose,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
}: NewsSidebarProps) {
  const t = useTranslations()
  const sourceCount = news.reduce((acc, item) => {
    console.log('x1 item', item)
    const sourceName =
      typeof item.source === 'string' ? item.source : item.source?.name || ''
    if (sourceName) {
      acc[sourceName] = (acc[sourceName] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const sortedSources = Object.entries(sourceCount)
    .sort(([, a], [, b]) => b - a)
    .map(([source]) => source)

  const sortedNews = [...news].sort((a, b) => {
    const aSourceName =
      typeof a.source === 'string' ? a.source : a.source?.name || ''
    const bSourceName =
      typeof b.source === 'string' ? b.source : b.source?.name || ''
    const aIndex = sortedSources.indexOf(aSourceName)
    const bIndex = sortedSources.indexOf(bSourceName)
    return aIndex - bIndex
  })

  const filteredNews = sortedNews

  return (
    <div className="h-screen w-full flex flex-col bg-white">
      {/* Header - Fixed */}
      <div className="flex-none p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold">{t('news.title')}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              {t('news.newsCount', {count: news.length})} •{' '}
              {t('locations.locationCount', {count: locations.length})}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {filteredNews.length} haber bulundu
        </div>
      </div>

      {/* View Type Tabs - Fixed */}
      <div className="flex-none p-4 border-b bg-white">
        <div className="flex bg-gray-50 rounded-lg">
          <button
            onClick={() => onViewTypeChange('card')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              viewType === 'card'
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            Kart
          </button>
          <button
            onClick={() => onViewTypeChange('horizontal')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              viewType === 'horizontal'
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            Yatay
          </button>
          <button
            onClick={() => onViewTypeChange('minimal')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              viewType === 'minimal'
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <AlignLeft className="w-4 h-4" />
            Basit
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {filteredNews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Haber bulunamadı.</p>
              <p className="text-sm mt-2">Filtreleri değiştirmeyi deneyin.</p>
            </div>
          ) : (
            <div className={viewType === 'minimal' ? 'space-y-2' : 'space-y-4'}>
              {filteredNews.map(item => {
                if (viewType === 'horizontal') {
                  return (
                    <NewsCardHorizontal
                      key={item.id}
                      news={item}
                      onLocationClick={onLocationSelect}
                    />
                  )
                } else if (viewType === 'minimal') {
                  return (
                    <NewsCardMinimal
                      key={item.id}
                      news={item}
                      onLocationClick={onLocationSelect}
                    />
                  )
                } else {
                  return (
                    <NewsCard
                      key={item.id}
                      news={item}
                      onLocationClick={onLocationSelect}
                    />
                  )
                }
              })}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && filteredNews.length > 0 && onLoadMore && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={onLoadMore}
                disabled={loadingMore}
                className="px-6 py-2"
                variant="outline"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    {t('common.loading')}
                  </>
                ) : (
                  t('news.loadMore')
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
