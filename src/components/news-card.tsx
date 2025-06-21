import Image from 'next/image'
import {NewsItem} from '@/lib/database'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {CalendarDays, MapPin} from 'lucide-react'
import {
  getCategoryKeyByName,
  getCategoryColorByKey,
} from '@/lib/category-colors'
import {getSourceLogo} from '@/lib/news-sources'

interface NewsCardProps {
  news: NewsItem
  onLocationClick: (location: string) => void
}

export default function NewsCard({news, onLocationClick}: NewsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Use key-based system for better multilingual support
  const categoryKey = getCategoryKeyByName(news.category)
  const categoryStyle = getCategoryColorByKey(categoryKey)

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className={`mb-2 ${categoryStyle.badge}`}>
            {news.category}
          </Badge>
          {news.externalUrl ? (
            <a
              href={news.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors group hover:underline"
            >
              <span>{getSourceLogo(news.source)}</span>
              <span>{news.source}</span>
            </a>
          ) : (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>{getSourceLogo(news.source)}</span>
              <span>{news.source}</span>
            </div>
          )}
        </div>
        <CardTitle className="text-lg leading-tight">{news.title}</CardTitle>
      </CardHeader>

      <CardContent>
        {news.imageUrl && (
          <Image
            src={news.imageUrl}
            alt={news.title}
            width={400}
            height={200}
            className="w-full h-32 sm:h-48 object-cover rounded-md mb-4"
          />
        )}

        <p className="text-gray-700 mb-4 line-clamp-3">{news.content}</p>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => onLocationClick(news.location)}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            {news.location}
          </button>

          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            {formatDate(news.publishedAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
