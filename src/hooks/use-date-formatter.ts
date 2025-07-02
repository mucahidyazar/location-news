import { useTranslations, useLocale } from 'next-intl'

export function useDateFormatter() {
  const t = useTranslations()
  const locale = useLocale()

  const formatDate = (dateString: string | null | undefined) => {
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

  const formatDateShort = (dateString: string | null | undefined) => {
    if (!dateString) return t('common.loading')
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return t('common.error')
    
    return date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return t('common.loading')
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return t('common.error')
    
    return date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return {
    formatDate,
    formatDateShort,
    formatDateTime
  }
}