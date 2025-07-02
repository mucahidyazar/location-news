'use client'

import React from 'react'
import {NewsItem} from '@/lib/types'
import NewsCard from './news-card'
import NewsCardHorizontal from './news-card-horizontal'
import NewsCardMinimal from './news-card-minimal'
import {Grid3X3, LayoutList, AlignLeft, Newspaper} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {useTranslations} from 'next-intl'
import {SidebarHeader} from '@/components/ui/sidebar-header'
import {LoadingSpinner} from '@/components/ui/loading-spinner'
import {cn} from '@/lib/utils'

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
    <div
      className="h-screen w-full flex flex-col bg-[var(--color-theme-bg-primary)]"
    >
      {/* Header - Fixed */}
      <div className="flex-none">
        <SidebarHeader
          icon={
            <Newspaper
              className="w-5 h-5 text-[var(--color-theme-primary-600)]"
            />
          }
          title={t('news.title')}
          subtitle={`${filteredNews.length} haber bulundu`}
          onClose={onClose || (() => {})}
          showCount={{
            label: `${t('news.newsCount', {count: news.length})} • ${t(
              'locations.locationCount',
              {count: locations.length},
            )}`,
            count: filteredNews.length,
          }}
        />
      </div>

      {/* View Type Tabs - Fixed */}
      <div
        className="flex-none p-4 border-b bg-[var(--color-theme-surface-primary)] border-[var(--color-theme-border-primary)]"
      >
        <div
          className="flex rounded-lg bg-[var(--color-theme-surface-tertiary)]"
        >
          <button
            onClick={() => onViewTypeChange('card')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all',
              viewType === 'card'
                ? 'bg-[var(--color-theme-primary-500)] text-[var(--color-theme-text-inverse)] border border-[var(--color-theme-primary-600)] shadow-[0_1px_2px_0_var(--color-theme-bg-overlay)]'
                : 'bg-transparent text-[var(--color-theme-text-secondary)] hover:bg-[var(--color-theme-surface-tertiary)] hover:text-[var(--color-theme-text-primary)]'
            )}
          >
            <Grid3X3 className="w-4 h-4" />
            Kart
          </button>
          <button
            onClick={() => onViewTypeChange('horizontal')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all',
              viewType === 'horizontal'
                ? 'bg-[var(--color-theme-primary-500)] text-[var(--color-theme-text-inverse)] border border-[var(--color-theme-primary-600)] shadow-[0_1px_2px_0_var(--color-theme-bg-overlay)]'
                : 'bg-transparent text-[var(--color-theme-text-secondary)] hover:bg-[var(--color-theme-surface-tertiary)] hover:text-[var(--color-theme-text-primary)]'
            )}
          >
            <LayoutList className="w-4 h-4" />
            Yatay
          </button>
          <button
            onClick={() => onViewTypeChange('minimal')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all',
              viewType === 'minimal'
                ? 'bg-[var(--color-theme-primary-500)] text-[var(--color-theme-text-inverse)] border border-[var(--color-theme-primary-600)] shadow-[0_1px_2px_0_var(--color-theme-bg-overlay)]'
                : 'bg-transparent text-[var(--color-theme-text-secondary)] hover:bg-[var(--color-theme-surface-tertiary)] hover:text-[var(--color-theme-text-primary)]'
            )}
          >
            <AlignLeft className="w-4 h-4" />
            Basit
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-24">
          {filteredNews.length === 0 ? (
            <div
              className="text-center py-8 text-[var(--color-theme-text-tertiary)]"
            >
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
                  <LoadingSpinner
                    size="sm"
                    variant="button"
                    text={t('common.loading')}
                    showText={false}
                  />
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
