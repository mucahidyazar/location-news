import Image from 'next/image';
import { NewsItem } from '@/lib/database';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin } from 'lucide-react';
import { getCategoryColor } from '@/lib/category-colors';
import { getSourceLogo } from '@/lib/news-sources';

interface NewsCardHorizontalProps {
  news: NewsItem;
  onLocationClick: (location: string) => void;
}

export default function NewsCardHorizontal({ news, onLocationClick }: NewsCardHorizontalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const categoryStyle = getCategoryColor(news.category);

  return (
    <Card className="mb-3 hover:shadow-lg transition-shadow">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Image */}
          {news.imageUrl && (
            <div className="flex-shrink-0">
              <Image
                src={news.imageUrl}
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
              <Badge variant="secondary" className={`${categoryStyle.badge} text-xs flex-shrink-0`}>
                {news.category}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                <span>{getSourceLogo(news.source)}</span>
                <span className="truncate">{news.source}</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2 flex-1">
              {news.title}
            </h3>
            
            <p className="text-gray-600 text-xs mb-3 line-clamp-2 flex-1">
              {news.content}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
              <button
                onClick={() => onLocationClick(news.location)}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors truncate flex-shrink-0 max-w-[50%]"
              >
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{news.location}</span>
              </button>
              
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                <CalendarDays className="w-3 h-3" />
                <span className="whitespace-nowrap">{formatDate(news.publishedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}