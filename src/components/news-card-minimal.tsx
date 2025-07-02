import { NewsItem } from '@/lib/types';
import { NewsSourceDisplay } from '@/components/ui/news-source-display'
import { useTheme } from '@/contexts/theme-context';
import { useDateFormatter } from '@/hooks/use-date-formatter';
// Removed unused imports since useDateFormatter handles locale internally
import {cn} from '@/lib/utils'

interface NewsCardMinimalProps {
  news: NewsItem;
  onLocationClick: (location: string) => void;
}

export default function NewsCardMinimal({ news }: NewsCardMinimalProps) {
  const { palette } = useTheme();
  const { formatDate } = useDateFormatter();


  return (
    <div className="mb-2 p-2">
      <div className="mb-1 flex items-center justify-between">
        <span className={cn("text-xs", `[color:${palette.text.tertiary}]`)}>{formatDate(news.published_at)}</span>
        <NewsSourceDisplay
          source={news.source}
          externalUrl={news.external_url}
        />
      </div>
      
      <h3 className={cn("font-medium text-sm leading-tight line-clamp-2", `[color:${palette.text.primary}]`)}>
        {news.title}
      </h3>
    </div>
  );
}