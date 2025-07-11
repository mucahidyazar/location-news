'use client'

import {useState, useCallback, useEffect, useMemo, memo} from 'react'
import {useSearchParams} from 'next/navigation'
import {Newspaper} from 'lucide-react'
import NewsCard from '@/components/news-card'
import {useTranslations} from 'next-intl'
import {LoadingSpinner} from '@/components/ui/loading-spinner'
import {LogoLoading} from '@/components/ui/logo-loading'
import {Button} from '@/components/ui/button'
import {useInfiniteNews, useCategories} from '@/hooks/use-news'
import {FiltersPanel} from '@/components/filters-panel'

// Separate component for news data to isolate re-renders
const NewsContent = memo(
  ({
    news,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isNewsLoading,
  }: {
    news: unknown[]
    hasNextPage: boolean
    isFetchingNextPage: boolean
    fetchNextPage: () => void
    isNewsLoading: boolean
  }) => {
    const t = useTranslations()

    const loadMore = async () => {
      if (hasNextPage && !isFetchingNextPage) {
        await fetchNextPage()
      }
    }

    if (isNewsLoading) {
      return <LogoLoading variant="page" text={t('common.loading')} size="lg" />
    }

    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item: any) => (
            <NewsCard key={item.id} news={item} onLocationClick={() => {}} />
          ))}
        </div>

        {hasNextPage && news.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={loadMore}
              disabled={isFetchingNextPage}
              className="px-8 py-2"
            >
              {isFetchingNextPage ? (
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

        {news.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="mx-auto h-12 w-12 text-[var(--color-theme-text-tertiary)]" />
            <h3 className="mt-4 text-lg font-medium text-[var(--color-theme-text-primary)]">
              {t('news.noNewsFound')}
            </h3>
            <p className="mt-2 text-[var(--color-theme-text-secondary)]">
              {t('news.changeSearchCriteria')}
            </p>
          </div>
        )}
      </>
    )
  },
)

NewsContent.displayName = 'NewsContent'

export default function NewsPage() {
  const t = useTranslations()
  // const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  // Input için local state (focus problemi çözülür)
  const [inputValue, setInputValue] = useState(searchParams.get('search') || '')
  // API call için debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    searchParams.get('search') || '',
  )

  // Categories için ayrı hook
  const {isPending: isCategoriesLoading} = useCategories()

  // News data for FiltersPanel
  const NEWS_PER_PAGE = 20
  const newsOptions = useMemo(
    () => ({
      searchTerm: debouncedSearchTerm || undefined,
      selectedCategory: selectedCategory || undefined,
      limit: NEWS_PER_PAGE,
    }),
    [debouncedSearchTerm, selectedCategory],
  )

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isNewsLoading,
  } = useInfiniteNews(newsOptions)

  // Tüm sayfaları flat array haline getir
  const news = useMemo(() => {
    return data?.pages.flat() || []
  }, [data])

  // Calculate unique sources and counts like in main page
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

  // inputValue değiştiğinde 500ms sonra debouncedSearchTerm'i güncelle
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(inputValue)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [inputValue])

  // URL'den gelen search parametresini input'a populate et (sadece ilk yüklemede)
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    if (urlSearch) {
      setInputValue(urlSearch)
      setDebouncedSearchTerm(urlSearch)
    }
  }, [searchParams]) // searchParams dependency added

  const clearFilters = useCallback(() => {
    setInputValue('')
    setDebouncedSearchTerm('')
    setSelectedCategory('')
  }, [])

  // Category handling for FiltersPanel
  const handleCategorySelect = useCallback((category: string) => {
    if (category === t('filters.all')) {
      setSelectedCategory('')
    } else {
      setSelectedCategory(category)
    }
  }, [t])

  // Source handling for FiltersPanel  
  const handleSourceSelect = useCallback((_source: string) => {
    // News sayfasında source filtering yok ama FiltersPanel için boş handler
  }, [])

  // Date range handling for FiltersPanel
  const handleDateRangeChange = useCallback((_start?: string, _end?: string) => {
    // News sayfasında date filtering yok ama FiltersPanel için boş handler
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    },
    [],
  )

  if (isCategoriesLoading) {
    return <LogoLoading variant="page" text={t('common.loading')} size="xl" />
  }

  return (
    <div className="h-full overflow-auto bg-[var(--color-theme-surface-primary)]">
      {/* Filters */}
      <FiltersPanel
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onClearFilters={clearFilters}
        selectedCategories={selectedCategory ? [selectedCategory] : [t('filters.all')]}
        selectedSources={[]}
        news={news}
        uniqueSources={uniqueSources}
        sourceCount={sourceCount}
        onCategorySelect={handleCategorySelect}
        onSourceSelect={handleSourceSelect}
        onDateRangeChange={handleDateRangeChange}
        dateRange={{}}
        defaultToLastWeek={false}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NewsContent
          news={news}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isNewsLoading={isNewsLoading}
        />
      </main>
    </div>
  )
}
