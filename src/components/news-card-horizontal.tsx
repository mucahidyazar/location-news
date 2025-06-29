import Image from 'next/image';
import { NewsItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin } from 'lucide-react';
import { getCategoryKeyByName } from '@/lib/category-colors';
import { getCategoryColorByKey } from '@/lib/theme-category-colors';
import { useTheme } from '@/contexts/theme-context';
import { SourceLogo } from '@/lib/news-sources'
import TwitterEmbed from './twitter-embed';

interface NewsCardHorizontalProps {
  news: NewsItem;
  onLocationClick: (location: string) => void;
}

export default function NewsCardHorizontal({ news, onLocationClick }: NewsCardHorizontalProps) {
  const { palette } = useTheme();
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Tarih belirtilmemiş'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Geçersiz tarih'
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Use key-based system for better multilingual support
  const categoryKey = getCategoryKeyByName(typeof news.category === 'string' ? news.category : news.category?.name || '');
  const categoryStyle = getCategoryColorByKey(categoryKey, palette);

  // Check if source is Twitter
  const sourceName = typeof news.source === 'string' ? news.source : news.source?.name || ''
  const isTwitterSource = sourceName.toLowerCase().includes('twitter') || 
                         sourceName.startsWith('@') ||
                         news.external_url?.includes('twitter.com');

  return (
    <Card className="mb-3 hover:shadow-lg transition-shadow">
      <CardContent className="p-3">
        {isTwitterSource && news.external_url ? (
          <TwitterEmbed url={news.external_url} className="mb-2" />
        ) : (
          <div className="flex gap-3">
            {/* Image */}
            {news.image_url && (
              <div className="flex-shrink-0">
                <Image
                  src={news.image_url}
                  alt={news.title}
                  width={100}
                  height={70}
                  className="w-[100px] h-[70px] object-cover rounded-md"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between mb-2 gap-2">
              <Badge 
                variant="secondary" 
                className="text-xs flex-shrink-0"
                style={{
                  backgroundColor: categoryStyle?.badge?.background || palette.surface.secondary,
                  color: categoryStyle?.badge?.text || palette.text.primary,
                  borderColor: categoryStyle?.badge?.border || palette.border.secondary
                }}
              >
                {typeof news.category === 'string' ? news.category : news.category?.name || ''}
              </Badge>
              {news.external_url ? (
                <a 
                  href={news.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs transition-colors truncate group"
                  style={{
                    color: palette.text.tertiary
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = palette.primary[600]
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = palette.text.tertiary
                  }}
                >
                  <SourceLogo source={news.source} />
                  <span className="truncate group-hover:underline">{sourceName}</span>
                </a>
              ) : (
                <div className="flex items-center gap-1 text-xs truncate" style={{color: palette.text.tertiary}}>
                  <SourceLogo source={news.source} />
                  <span className="truncate">{sourceName}</span>
                </div>
              )}
            </div>
            
            <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2 flex-1">
              {news.title}
            </h3>
            
            <p className="text-gray-600 text-xs mb-3 line-clamp-2 flex-1">
              {news.content}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
              <button
                onClick={() => {
                  const locationName = typeof news.location === 'string' 
                    ? news.location 
                    : news.location?.name || news.location_name || ''
                  onLocationClick(locationName)
                }}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors truncate flex-shrink-0 max-w-[50%]"
              >
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                  {typeof news.location === 'string' 
                    ? news.location 
                    : news.location?.name || news.location_name || ''}
                </span>
              </button>
              
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                <CalendarDays className="w-3 h-3" />
                <span className="whitespace-nowrap">{formatDate(news.published_at || '')}</span>
              </div>
            </div>
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
}