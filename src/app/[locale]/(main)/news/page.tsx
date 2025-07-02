'use client'

import {useState, useCallback, useEffect, useMemo, memo} from 'react'
import {useSearchParams} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Newspaper, Search, X} from 'lucide-react'
import NewsCard from '@/components/news-card'
import {useTranslations} from 'next-intl'
import {LoadingSpinner} from '@/components/ui/loading-spinner'
import {useInfiniteNews, useCategories} from '@/hooks/use-news'

// Separate component for news data to isolate re-renders
const NewsContent = memo(
  ({
    searchTerm,
    selectedCategory,
  }: {
    searchTerm: string
    selectedCategory: string
  }) => {
    const t = useTranslations()
    const NEWS_PER_PAGE = 20

    const newsOptions = useMemo(
      () => ({
        searchTerm: searchTerm || undefined,
        selectedCategory: selectedCategory || undefined,
        limit: NEWS_PER_PAGE,
      }),
      [searchTerm, selectedCategory],
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

    const loadMore = async () => {
      if (hasNextPage && !isFetchingNextPage) {
        await fetchNextPage()
      }
    }

    if (isNewsLoading) {
      return (
        <LoadingSpinner size="xl" variant="page" text={t('common.loading')} />
      )
    }

    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {news.map(item => (
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
  const {data: categories = [], isPending: isCategoriesLoading} =
    useCategories()

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

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    },
    [],
  )

  if (isCategoriesLoading) {
    return (
      <LoadingSpinner size="xl" variant="page" text={t('common.loading')} />
    )
  }

  return (
    <div className="h-full overflow-auto bg-[var(--color-theme-surface-primary)]">
      {/* Filters */}
      <div className="shadow-sm bg-[var(--color-theme-surface-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search city, news title, or any keyword"
                value={inputValue}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory || 'all'}
              onValueChange={value =>
                setSelectedCategory(value === 'all' ? '' : value)
              }
            >
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
            {(inputValue || selectedCategory) && (
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
        <NewsContent
          searchTerm={debouncedSearchTerm}
          selectedCategory={selectedCategory}
        />
      </main>
    </div>
  )
}
