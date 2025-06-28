import Image from 'next/image'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {CalendarDays, MapPin} from 'lucide-react'
import {NewsCardProps} from '@/lib/types'
import {SourceLogo} from '@/lib/news-sources'
import {
  getCategoryKeyByName,
  getCategoryColorByKey,
} from '@/lib/category-colors'
import {useTranslations, useLocale} from 'next-intl'
import TwitterEmbed from './twitter-embed'

export default function NewsCard({news, onLocationClick}: NewsCardProps) {
  const t = useTranslations()
  const locale = useLocale()
  
  const formatDate = (dateString: string) => {
    if (!dateString) return t('common.loading')
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return t('common.error')
    return date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Use key-based system for better multilingual support
  const rawCategoryName = typeof news.category === 'string'
    ? news.category
    : news.category?.name || ''
  const categoryKey = getCategoryKeyByName(rawCategoryName)
  const categoryStyle = getCategoryColorByKey(categoryKey)
  
  // Get translated category name
  const getTranslatedCategoryName = (categoryName: string) => {
    if (!categoryName) return ''
    const key = getCategoryKeyByName(categoryName)
    return t(`categories.${key}`)
  }

  // Check if source is Twitter
  const sourceName =
    typeof news.source === 'string' ? news.source : news.source?.name || ''
  const isXSource =
    sourceName.toLowerCase().includes('x') ||
    sourceName.startsWith('@') ||
    news.external_url?.includes('x.com')

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow py-4">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          {news.category && (
            <Badge
              variant="secondary"
              className={`${categoryStyle.badge} text-xs`}
            >
              {getTranslatedCategoryName(rawCategoryName)}
            </Badge>
          )}
          {news.external_url ? (
            <a
              href={news.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors group hover:underline"
            >
              <SourceLogo source={news.source} />
              <span>{sourceName}</span>
            </a>
          ) : (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <SourceLogo source={news.source} />
              <span>{sourceName}</span>
            </div>
          )}
        </div>
        <CardTitle className="text-lg leading-tight">{news.title}</CardTitle>
      </CardHeader>

      <CardContent>
        {isXSource && news.external_url ? (
          <TwitterEmbed url={news.external_url} className="mb-4" />
        ) : (
          <>
            {news.image_url && (
              <Image
                src={news.image_url}
                alt={news.title}
                width={400}
                height={200}
                className="w-full h-32 sm:h-48 object-cover rounded-md mb-4"
              />
            )}
            <p className="text-gray-700 mb-4 line-clamp-3">{news.content}</p>
          </>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-gray-500">
          {onLocationClick && (
            <button
              onClick={() => {
                const locationName = news.location_name || ''
                onLocationClick(locationName)
              }}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              {news.location_name || ''}
            </button>
          )}

          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            {formatDate(news.published_at || '')}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
