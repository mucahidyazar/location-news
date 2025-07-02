'use client'

import {useState, useEffect, useCallback, useMemo} from 'react'
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  MapPin,
  Mail,
  AlertCircle,
  Shield,
  Search,
} from 'lucide-react'
import {SidebarHeader} from '@/components/ui/sidebar-header'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {LoadingSpinner} from '@/components/ui/loading-spinner'
import {cn} from '@/lib/utils'
import {useInfiniteAdminNews} from '@/hooks/use-news'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface AdminActionFormProps {
  newsId: string
  onAction: (
    newsId: string,
    action: 'approve' | 'reject',
    notes?: string,
  ) => Promise<void>
  processing: boolean
}

function AdminActionForm({newsId, onAction, processing}: AdminActionFormProps) {
  const [notes, setNotes] = useState('')
  const [showNotesInput, setShowNotesInput] = useState(false)

  const handleApprove = async () => {
    await onAction(newsId, 'approve', notes.trim() || undefined)
    setNotes('')
    setShowNotesInput(false)
  }

  const handleReject = async () => {
    await onAction(newsId, 'reject', notes.trim() || undefined)
    setNotes('')
    setShowNotesInput(false)
  }

  return (
    <div className="mt-3 space-y-2">
      {/* Notes Input */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label
            htmlFor={`notes-${newsId}`}
            className="text-xs font-medium text-gray-600"
          >
            Not (opsiyonel):
          </label>
          <button
            onClick={() => setShowNotesInput(!showNotesInput)}
            className="text-xs text-blue-600 hover:underline"
          >
            {showNotesInput ? 'Gizle' : 'Ekle'}
          </button>
        </div>

        {showNotesInput && (
          <textarea
            id={`notes-${newsId}`}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Onay/red sebebi veya notlarınızı yazın..."
            className={cn(
              'w-full px-2 py-1 text-xs rounded border resize-none',
              '[background-color:var(--color-theme-surface-secondary)]',
              '[border-color:var(--color-theme-border-primary)]',
              '[color:var(--color-theme-text-primary)]',
              'focus:outline-none focus:ring-1 focus:ring-blue-500',
            )}
            rows={2}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleApprove}
          disabled={processing}
          size="sm"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          {processing ? 'İşleniyor...' : 'Onayla'}
        </Button>

        <Button
          onClick={handleReject}
          disabled={processing}
          size="sm"
          variant="outline"
          className="flex-1 text-red-600 border-red-600 hover:bg-red-50 text-xs"
        >
          <XCircle className="w-3 h-3 mr-1" />
          Reddet
        </Button>
      </div>
    </div>
  )
}

export function AdminSidebar({isOpen, onClose}: AdminSidebarProps) {
  const [processing, setProcessing] = useState<string | null>(null)
  const [showOnlyPending, setShowOnlyPending] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(inputValue)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [inputValue])

  // Query options'ı memoize et
  const queryOptions = useMemo(
    () => ({
      status: showOnlyPending ? ('pending' as const) : undefined,
      searchTerm: debouncedSearchTerm.trim() || undefined,
      limit: 10,
    }),
    [showOnlyPending, debouncedSearchTerm],
  )

  // UseInfiniteQuery hook
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: loading,
    refetch,
  } = useInfiniteAdminNews(queryOptions)

  // Tüm sayfaları flat array haline getir
  const pendingNews = useMemo(() => {
    return data?.pages.flat() || []
  }, [data])

  const handleNewsAction = async (
    newsId: string,
    action: 'approve' | 'reject',
    notes?: string,
  ) => {
    setProcessing(newsId)
    try {
      const response = await fetch('/api/admin/news-reports', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newsId,
          action,
          notes,
        }),
      })

      if (response.ok) {
        // Refresh the list
        await refetch()

        // Notify main page to refresh news data if approved
        if (action === 'approve') {
          window.dispatchEvent(new CustomEvent('newsApproved'))
        }
      } else {
        console.error('Failed to update news status')
        alert('İşlem başarısız oldu. Lütfen tekrar deneyin.')
      }
    } catch (error) {
      console.error('Error updating news status:', error)
      alert('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setProcessing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            <Clock className="w-3 h-3 mr-1" />
            Bekliyor
          </Badge>
        )
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Onaylandı
          </Badge>
        )
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Reddedildi
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const pendingCount = pendingNews.filter(n => n.status === 'pending').length

  const handleFilterChange = (onlyPending: boolean) => {
    setShowOnlyPending(onlyPending)
    // Filter değiştiğinde mevcut cache'i invalidate et
    refetch()
  }

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    },
    [],
  )

  if (!isOpen) {
    return null
  }

  return (
    <div className="h-full flex flex-col [background-color:var(--color-theme-surface-primary)]">
      <SidebarHeader
        icon={<Shield className="w-5 h-5" />}
        title="Moderasyon"
        subtitle={`${pendingCount} bekleyen haber`}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={inputValue}
              onChange={handleSearchChange}
              placeholder="Başlık, konum veya e-posta ile ara..."
              className={cn(
                'w-full pl-10 pr-3 py-2 text-sm rounded-lg border',
                '[background-color:var(--color-theme-surface-secondary)]',
                '[border-color:var(--color-theme-border-primary)]',
                '[color:var(--color-theme-text-primary)]',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                'placeholder:text-gray-400',
              )}
            />
          </div>
        </div>

        {/* Filter Checkbox */}
        <div className="mb-4 p-3 rounded-lg bg-[var(--color-theme-surface-secondary)]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyPending}
              onChange={e => handleFilterChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-[var(--color-theme-text-primary)]">
              Sadece bekleyen haberleri göster
            </span>
          </label>
          <p className="text-xs mt-1 text-[var(--color-theme-text-secondary)]">
            {showOnlyPending
              ? `${pendingCount} bekleyen haber gösteriliyor`
              : `${pendingNews.length} toplam haber gösteriliyor`}
            {inputValue && ` • "${inputValue}" araması`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" text="Yükleniyor..." />
          </div>
        ) : pendingNews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>
              {showOnlyPending
                ? 'Bekleyen haber bulunmuyor'
                : 'Henüz haber bildirimi yok'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingNews.map(news => (
              <div
                key={news.id}
                className={cn(
                  'rounded-lg border p-4',
                  '[background-color:var(--color-theme-surface-secondary)]',
                  '[border-color:var(--color-theme-border-primary)]',
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-sm leading-tight pr-2">
                    {news.title}
                  </h3>
                  {getStatusBadge(news.status)}
                </div>

                {news.content && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {news.content}
                  </p>
                )}

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{news.location_name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{news.submitted_by_email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    <a
                      href={news.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      Kaynak
                    </a>
                  </div>

                  {news.category && (
                    <div className="text-xs">
                      <span className="font-medium">Kategori:</span>{' '}
                      {news.category.name}
                    </div>
                  )}

                  <div className="text-xs">
                    <span className="font-medium">Tarih:</span>{' '}
                    {new Date(news.created_at).toLocaleDateString('tr-TR')}
                  </div>

                  {news.status_notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <span className="font-medium">Not:</span>{' '}
                      {news.status_notes}
                    </div>
                  )}
                </div>

                {news.status === 'pending' && (
                  <AdminActionForm
                    newsId={news.id}
                    onAction={handleNewsAction}
                    processing={processing === news.id}
                  />
                )}
              </div>
            ))}

            {/* Load More Button */}
            {hasNextPage && pendingNews.length > 0 && (
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  {isFetchingNextPage ? (
                    <LoadingSpinner
                      size="sm"
                      text="Yükleniyor..."
                      showText={false}
                    />
                  ) : (
                    'Daha fazla yükle'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
