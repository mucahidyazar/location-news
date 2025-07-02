'use client'

import {useState, useEffect} from 'react'
import {X, MapPin, AlertCircle} from 'lucide-react'
import {cn} from '@/lib/utils'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'

// Zod schema for validation
const newsReportSchema = z.object({
  title: z
    .string()
    .min(5, 'Başlık en az 5 karakter olmalıdır')
    .max(200, 'Başlık en fazla 200 karakter olabilir'),
  content: z
    .string()
    .max(2000, 'İçerik en fazla 2000 karakter olabilir')
    .optional()
    .or(z.literal('')),
  location_name: z
    .string()
    .min(2, 'Konum en az 2 karakter olmalıdır')
    .max(100, 'Konum en fazla 100 karakter olabilir'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  category_id: z.string().min(1, 'Lütfen bir kategori seçin'),
  submitter_email: z.string().email('Geçerli bir e-posta adresi girin'),
  source_url: z
    .string()
    .min(1, 'Kaynak link zorunludur')
    .url('Geçerli bir URL girin'),
  image_url: z
    .string()
    .url("Geçerli bir resim URL'si girin")
    .optional()
    .or(z.literal('')),
  recaptcha_token: z.string().optional(),
})

type NewsReportFormData = z.infer<typeof newsReportSchema>

interface NewsReportFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: NewsReportFormData) => Promise<void>
  isSidebarOpen?: boolean
  selectedCoordinates?: {lat: number; lng: number} | null
}

interface Category {
  id: string
  name: string
  color: string
}

export function NewsReportForm({
  isOpen,
  onClose,
  onSubmit,
  isSidebarOpen = false,
  selectedCoordinates,
}: NewsReportFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
    setValue,
    watch,
  } = useForm<NewsReportFormData>({
    resolver: zodResolver(newsReportSchema),
    defaultValues: {
      title: '',
      content: '',
      location_name: '',
      category_id: '',
      submitter_email: '',
      source_url: '',
      image_url: '',
      recaptcha_token:
        process.env.NODE_ENV === 'development' ? 'dev-token' : '',
    },
  })

  const watchedValues = watch()

  // Load categories from database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          // API directly returns array, not nested in categories property
          setCategories(Array.isArray(data) ? data : [])
        } else {
          console.error('Failed to load categories')
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  // Update coordinates when map is clicked
  useEffect(() => {
    if (selectedCoordinates && isOpen) {
      setValue('latitude', selectedCoordinates.lat)
      setValue('longitude', selectedCoordinates.lng)

      // Optional: Try to get location name from coordinates
      reverseGeocode(selectedCoordinates.lat, selectedCoordinates.lng)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCoordinates, isOpen, setValue])

  // Simple reverse geocoding using Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      )
      const data = await response.json()

      if (data.display_name) {
        // Extract city or town name from the address
        const address = data.address || {}
        const locationName =
          address.town ||
          address.city ||
          address.village ||
          address.municipality ||
          data.display_name.split(',')[0]
        setValue('location_name', locationName)
      }
    } catch (error) {
      console.log('Reverse geocoding failed:', error)
      // Don't show error to user, just log it
    }
  }

  const onFormSubmit = async (data: NewsReportFormData) => {
    setSubmitError(null)

    // Validate reCAPTCHA in production
    if (process.env.NODE_ENV !== 'development' && !data.recaptcha_token) {
      setSubmitError('Lütfen güvenlik doğrulamasını tamamlayın')
      return
    }

    try {
      await onSubmit(data)
      reset()
      onClose()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Bir hata oluştu')
    }
  }

  const handleLocationSelect = async () => {
    if (!navigator.geolocation) {
      setSubmitError('Tarayıcınız konum özelliğini desteklemiyor.')
      return
    }

    try {
      // First check permissions
      const permission = await navigator.permissions.query({
        name: 'geolocation',
      })

      if (permission.state === 'denied') {
        setSubmitError(
          'Konum izni reddedildi. Tarayıcı ayarlarından konum iznini açın.',
        )
        return
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          setValue('latitude', position.coords.latitude)
          setValue('longitude', position.coords.longitude)
          setSubmitError(null) // Clear any previous errors
        },
        error => {
          console.error('Location error:', error)
          let errorMessage = 'Konum alınamadı. '

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage +=
                'Konum izni reddedildi. Tarayıcı ayarlarından konum iznini açın.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage +=
                'Konum bilgisi alınamıyor. GPS/WiFi açık olduğundan emin olun.'
              break
            case error.TIMEOUT:
              errorMessage +=
                'Konum alma işlemi zaman aşımına uğradı. Tekrar deneyin.'
              break
            default:
              errorMessage += 'Lütfen manuel olarak konum girin.'
              break
          }

          setSubmitError(errorMessage)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    } catch (error) {
      console.error('Permission check error:', error)
      setSubmitError(
        'Konum özelliği kullanılamıyor. Lütfen manuel olarak konum girin.',
      )
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed bottom-24 z-40 w-96 max-h-[calc(100vh-8rem)] overflow-y-auto',
        'rounded-lg shadow-2xl transition-all duration-300',
        '[background-color:var(--color-theme-surface-primary)]',
        '[border:1px_solid_var(--color-theme-border-primary)] z-[10000]',
        // Dynamic positioning based on sidebar state
        isSidebarOpen ? 'right-[420px]' : 'right-6',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-[var(--color-theme-text-primary)]">
          Haber Bildir
        </h2>
        <button
          onClick={onClose}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'hover:[background-color:var(--color-theme-surface-secondary)]',
          )}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="p-4 space-y-4">
        {submitError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium mb-1 text-[var(--color-theme-text-primary)]"
          >
            Başlık *
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className={cn(
              'w-full px-3 py-2 rounded-lg border text-sm',
              '[background-color:var(--color-theme-surface-secondary)]',
              '[border-color:var(--color-theme-border-primary)]',
              '[color:var(--color-theme-text-primary)]',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.title && 'border-red-500',
            )}
            placeholder="Haber başlığını girin..."
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium mb-1 text-[var(--color-theme-text-primary)]"
          >
            İçerik
          </label>
          <textarea
            id="content"
            rows={3}
            {...register('content')}
            className={cn(
              'w-full px-3 py-2 rounded-lg border resize-none text-sm',
              '[background-color:var(--color-theme-surface-secondary)]',
              '[border-color:var(--color-theme-border-primary)]',
              '[color:var(--color-theme-text-primary)]',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.content && 'border-red-500',
            )}
            placeholder="Haber detaylarını açıklayın..."
          />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium mb-1 text-[var(--color-theme-text-primary)]"
          >
            Kategori *
          </label>
          <select
            id="category"
            {...register('category_id')}
            disabled={isLoadingCategories}
            className={cn(
              'w-full px-3 py-2 rounded-lg border text-sm',
              '[background-color:var(--color-theme-surface-secondary)]',
              '[border-color:var(--color-theme-border-primary)]',
              '[color:var(--color-theme-text-primary)]',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              errors.category_id && 'border-red-500',
            )}
          >
            <option value="">
              {isLoadingCategories
                ? 'Kategoriler yükleniyor...'
                : 'Kategori seçin...'}
            </option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.category_id.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium mb-1 text-[var(--color-theme-text-primary)]"
          >
            Konum *
          </label>
          <div className="flex gap-2">
            <input
              id="location"
              type="text"
              {...register('location_name')}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg border text-sm',
                '[background-color:var(--color-theme-surface-secondary)]',
                '[border-color:var(--color-theme-border-primary)]',
                '[color:var(--color-theme-text-primary)]',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.location_name && 'border-red-500',
              )}
              placeholder="Konum adını girin veya haritadan seçin..."
            />
            <button
              type="button"
              onClick={handleLocationSelect}
              className={cn(
                'px-2 py-2 rounded-lg border',
                '[background-color:var(--color-theme-surface-secondary)]',
                '[border-color:var(--color-theme-border-primary)]',
                'hover:[background-color:var(--color-theme-surface-tertiary)]',
                'transition-colors',
              )}
              title="Mevcut konumu al"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            💡 İpucu: Harita üzerinde bir yere tıklayarak da konum
            seçebilirsiniz
          </p>
          {errors.location_name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.location_name.message}
            </p>
          )}
          {watchedValues.latitude && watchedValues.longitude && (
            <p className="text-xs text-green-600 mt-1">
              Konum: {watchedValues.latitude.toFixed(4)},{' '}
              {watchedValues.longitude.toFixed(4)}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1 text-[var(--color-theme-text-primary)]"
          >
            E-posta Adresiniz *
          </label>
          <input
            id="email"
            type="email"
            {...register('submitter_email')}
            className={cn(
              'w-full px-3 py-2 rounded-lg border text-sm',
              '[background-color:var(--color-theme-surface-secondary)]',
              '[border-color:var(--color-theme-border-primary)]',
              '[color:var(--color-theme-text-primary)]',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.submitter_email && 'border-red-500',
            )}
            placeholder="E-posta adresinizi girin..."
          />
          {errors.submitter_email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.submitter_email.message}
            </p>
          )}
        </div>

        {/* Source URL */}
        <div>
          <label
            htmlFor="source_url"
            className="block text-sm font-medium mb-1 text-[var(--color-theme-text-primary)]"
          >
            Kaynak Link *
          </label>
          <input
            id="source_url"
            type="url"
            {...register('source_url')}
            className={cn(
              'w-full px-3 py-2 rounded-lg border text-sm',
              '[background-color:var(--color-theme-surface-secondary)]',
              '[border-color:var(--color-theme-border-primary)]',
              '[color:var(--color-theme-text-primary)]',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.source_url && 'border-red-500',
            )}
            placeholder="https://example.com/haber-linki"
          />
          {errors.source_url && (
            <p className="text-red-500 text-xs mt-1">
              {errors.source_url.message}
            </p>
          )}
        </div>

        {/* reCAPTCHA */}
        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-theme-text-primary)]">
            Güvenlik Doğrulaması *
          </label>
          {process.env.NODE_ENV === 'development' ? (
            <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-500 text-xs">
                reCAPTCHA (geliştirme modunda devre dışı)
              </p>
              <button
                type="button"
                onClick={() => setValue('recaptcha_token', 'dev-token')}
                className="mt-1 text-xs text-blue-600 hover:text-blue-800"
              >
                Dev için doğrula
              </button>
            </div>
          ) : (
            <div className="p-3 border border-gray-300 rounded-lg">
              <div id="recaptcha-container" className="flex justify-center">
                {/* reCAPTCHA widget will be rendered here */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    reCAPTCHA doğrulaması gerekli
                  </p>
                  <div className="bg-gray-100 p-4 rounded border-2 border-dashed">
                    <p className="text-xs text-gray-500">
                      reCAPTCHA widget burada olacak
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Site anahtarı:{' '}
                    {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
                      'Ayarlanmamış'}
                  </p>
                </div>
              </div>
            </div>
          )}
          {watchedValues.recaptcha_token && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Güvenlik doğrulaması tamamlandı
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg border transition-colors text-sm',
              '[background-color:var(--color-theme-surface-secondary)]',
              '[border-color:var(--color-theme-border-primary)]',
              '[color:var(--color-theme-text-primary)]',
              'hover:[background-color:var(--color-theme-surface-tertiary)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg transition-colors text-sm',
              '[background-color:var(--color-theme-primary-500)]',
              '[color:var(--color-theme-primary-foreground)]',
              'hover:[background-color:var(--color-theme-primary-600)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </form>
    </div>
  )
}
