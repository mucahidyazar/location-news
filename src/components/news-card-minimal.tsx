import { NewsItem } from '@/lib/types';
import { getSourceLogo } from '@/lib/news-sources';

interface NewsCardMinimalProps {
  news: NewsItem;
  onLocationClick: (location: string) => void;
}

export default function NewsCardMinimal({ news }: NewsCardMinimalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  return (
    <div className="mb-2 p-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-gray-500">{formatDate(news.publishedAt || news.published_at || '')}</span>
        {(news.externalUrl || news.external_url) ? (
          <a 
            href={news.externalUrl || news.external_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors group"
          >
            <span>{getSourceLogo(typeof news.source === 'string' ? news.source : news.source?.name || '')}</span>
            <span className="group-hover:underline">{typeof news.source === 'string' ? news.source : news.source?.name || ''}</span>
          </a>
        ) : (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>{getSourceLogo(typeof news.source === 'string' ? news.source : news.source?.name || '')}</span>
            <span>{typeof news.source === 'string' ? news.source : news.source?.name || ''}</span>
          </div>
        )}
      </div>
      
      <h3 className="font-medium text-sm leading-tight text-gray-900 line-clamp-2">
        {news.title}
      </h3>
    </div>
  );
}