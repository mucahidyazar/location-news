'use client'

import React, {useCallback} from 'react'
import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Badge} from '@/components/ui/badge'
import {Search, X, Globe, Tv, Building, Newspaper} from 'lucide-react'
import {useTranslations} from 'next-intl'
import SmartDatePicker from '@/components/smart-date-picker'
import {
  categoryKeys,
  getCategoryColor,
  getCategoryKeyByName,
  getCategoryColorByKey,
} from '@/lib/category-colors'

interface FiltersPanelProps {
  className?: string
  // Common props
  inputValue: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClearFilters: () => void
  // Props for all sections
  selectedLocation?: string
  selectedCategories?: string[]
  selectedSources?: string[]
  dateRange?: {start?: string; end?: string}
  onDateRangeChange?: (start?: string, end?: string) => void
  onCategorySelect?: (category: string) => void
  onSourceSelect?: (source: string) => void
  news?: any[]
  uniqueSources?: string[]
  sourceCount?: Record<string, number>
  defaultToLastWeek?: boolean
}

export function FiltersPanel({
  className,
  inputValue,
  onInputChange,
  onClearFilters,
  selectedLocation,
  selectedCategories = [],
  selectedSources = [],
  dateRange = {},
  onDateRangeChange,
  onCategorySelect,
  onSourceSelect,
  news = [],
  uniqueSources = [],
  sourceCount = {},
  defaultToLastWeek = true,
}: FiltersPanelProps) {
  const t = useTranslations()

  const getSourceIcon = useCallback((source: string) => {
    if (source.toLowerCase().includes('haber')) return Newspaper
    if (
      source.toLowerCase().includes('tv') ||
      source.toLowerCase().includes('medya')
    )
      return Tv
    if (
      source.toLowerCase().includes('tech') ||
      source.toLowerCase().includes('teknoloji')
    )
      return Building
    return Globe
  }, [])

  const getLocalizedCategories = useCallback(() => {
    return categoryKeys.map(key => {
      if (key === 'all') return t('filters.all')
      return t(`categories.${key}`)
    })
  }, [t])

  const hasFilters = selectedLocation ||
    !selectedCategories.includes(t('filters.all')) ||
    selectedSources.length > 0 ||
    inputValue ||
    dateRange?.start ||
    dateRange?.end

  return (
    <div
      className={cn(
        // Base styles
        'transition-all duration-300 backdrop-blur-sm rounded-lg p-2 md:p-4 shadow-lg space-y-2 md:space-y-4 opacity-85 hover:opacity-95 bg-[var(--color-theme-surface-primary)]',
        // Default styles for news page
        'shadow-sm bg-[var(--color-theme-surface-secondary)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4',
        className,
      )}
    >
      {/* Search and Main Filters */}
      <div className="flex gap-2 md:gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[150px] md:min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search city, news title, or any keyword"
            value={inputValue}
            onChange={onInputChange}
            className="pl-10 h-8 text-sm"
          />
        </div>

        {/* Date Picker */}
        {onDateRangeChange && (
          <SmartDatePicker
            onDateRangeChange={onDateRangeChange}
            className="w-full md:w-[320px]"
            defaultToLastWeek={defaultToLastWeek}
          />
        )}
        
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 h-8 px-2 text-xs cursor-pointer mx-auto"
          >
            <X className="w-3 h-3 mr-1" />
            {t('common.clear')}
          </Button>
        )}
      </div>

      {/* News Sources Filter */}
      {uniqueSources.length > 0 && (
        <div className="max-h-20 md:max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="flex flex-wrap gap-1 md:gap-2">
            {uniqueSources.map(source => {
              const IconComponent = getSourceIcon(source)
              const sourceNewsCount = sourceCount[source] || 0
              return (
                <button
                  key={source}
                  onClick={() => onSourceSelect?.(source)}
                  className={cn(
                    'flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg transition-all border-2',
                    selectedSources.includes(source)
                      ? 'shadow-sm border-[var(--color-theme-primary-300)] bg-[var(--color-theme-primary-50)] text-[var(--color-theme-primary-600)]'
                      : 'border-transparent bg-[var(--color-theme-surface-secondary)] text-[var(--color-theme-text-primary)] hover:bg-[var(--color-theme-surface-tertiary)]',
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium">{source}</span>
                    <span className="text-xs opacity-75">
                      {sourceNewsCount} haber
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Category Filter Badges */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1 md:gap-2">
          {getLocalizedCategories().map(category => {
            const isSelected = selectedCategories.includes(category)
            const categoryKey =
              category === t('filters.all')
                ? 'other_incidents'
                : getCategoryKeyByName(category)
            const categoryStyle =
              category === t('filters.all')
                ? getCategoryColor(category)
                : getCategoryColorByKey(categoryKey)
            const categoryNewsCount =
              category === t('filters.all')
                ? news.length
                : news.filter(
                    item =>
                      (typeof item.category === 'string'
                        ? item.category
                        : item.category?.name) === category,
                  ).length

            return (
              <Badge
                key={category}
                variant="secondary"
                className={`cursor-pointer transition-all duration-200 text-xs flex items-center gap-1 ${
                  isSelected
                    ? `${categoryStyle.badge} opacity-100`
                    : `bg-opacity-20 hover:bg-opacity-40 opacity-70 hover:opacity-100`
                } border border-opacity-30`}
                style={{
                  backgroundColor: isSelected
                    ? undefined
                    : `${categoryStyle.hex}20`,
                  borderColor: categoryStyle.hex,
                  color: categoryStyle.hex,
                }}
                onClick={() => onCategorySelect?.(category)}
              >
                <span>{category}</span>
                <span className="text-xs opacity-60">
                  ({categoryNewsCount})
                </span>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}