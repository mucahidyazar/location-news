'use client'

import React from 'react'
import {useTheme} from '@/contexts/theme-context'
import {Button} from '@/components/ui/button'
import {Palette, Check} from 'lucide-react'
import {cn} from '@/lib/utils'

interface ThemeSwitcherProps {
  variant?: 'default' | 'compact' | 'preview'
  showPreview?: boolean
}

export function ThemeSwitcher({
  variant = 'default',
  showPreview = true,
}: ThemeSwitcherProps) {
  const {currentTheme, palette, setTheme, availableThemes} = useTheme()

  if (variant === 'compact') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const currentIndex = availableThemes.indexOf(currentTheme)
          const nextIndex = (currentIndex + 1) % availableThemes.length
          setTheme(availableThemes[nextIndex])
        }}
        className="gap-2"
      >
        <Palette className="w-4 h-4" />
        {palette.displayName}
      </Button>
    )
  }

  const ThemePreview = ({
    themeName,
    isSelected,
  }: {
    themeName: string
    isSelected: boolean
  }) => {
    const theme = useTheme()
    const previewPalette = theme.availableThemes.includes(themeName)
      ? themeName === 'aurora'
        ? theme.palette
        : themeName === 'midnight'
        ? {
            primary: {500: '#64748b'},
            secondary: {500: '#71717a'},
            background: {primary: '#0f172a'},
            text: {primary: '#f8fafc'},
          }
        : {
            primary: {500: '#f2750a'},
            secondary: {500: '#a855f7'},
            background: {primary: '#fffbf5'},
            text: {primary: '#451a03'},
          }
      : theme.palette

    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-[var(--color-theme-primary-50)] hover:border-[var(--color-theme-primary-200)] hover:text-[var(--color-theme-primary-900)]',
          isSelected &&
            'bg-[var(--color-theme-primary-50)] border-[var(--color-theme-primary-200)] text-[var(--color-theme-primary-900)]',
        )}
      >
        <div className="flex gap-1">
          <div
            className="w-4 h-4 rounded-full border"
            style={{
              backgroundColor: previewPalette.primary[500],
borderColor: 'var(--color-theme-border-secondary)',
            }}
          />
          <div
            className="w-4 h-4 rounded-full border"
            style={{
              backgroundColor: previewPalette.secondary[500],
borderColor: 'var(--color-theme-border-secondary)',
            }}
          />
          <div
            className="w-4 h-4 rounded-full border"
            style={{
              backgroundColor: previewPalette.background.primary,
borderColor: 'var(--color-theme-border-secondary)',
            }}
          />
        </div>
        <div className="flex-1">
          <div
            className={cn(
              "font-medium text-sm capitalize",
              isSelected
                ? "text-[var(--color-theme-primary-900)]"
                : "text-[var(--color-theme-text-primary)]"
            )}
          >
            {themeName}
          </div>
          <div
            className={cn(
              "text-xs",
              isSelected
                ? "text-[var(--color-theme-primary-700)]"
                : "text-[var(--color-theme-text-tertiary)]"
            )}
          >
            {themeName === 'aurora' && 'Ethereal blues and greens'}
            {themeName === 'midnight' && 'Deep cosmic blues with silver'}
            {themeName === 'sunset' && 'Warm oranges and purples'}
          </div>
        </div>
        {isSelected && (
          <Check
            className="w-4 h-4 text-[var(--color-theme-primary-600)]"
          />
        )}
      </div>
    )
  }

  if (variant === 'preview') {
    return (
      <div className="space-y-3">
        <div
          className="flex items-center gap-1 text-sm font-medium text-[var(--color-theme-text-primary)]"
        >
          <Palette
            className="w-4 h-4 text-[var(--color-theme-primary-600)]"
          />
          Color Palette
        </div>
        <div className="space-y-2">
          {availableThemes.map(themeName => (
            <div key={themeName} onClick={() => setTheme(themeName)}>
              <ThemePreview
                themeName={themeName}
                isSelected={currentTheme === themeName}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          <span className="font-medium">Theme Settings</span>
        </div>
        <div className="text-sm text-gray-500">
          Current: {palette.displayName}
        </div>
      </div>

      {showPreview && (
        <div className="grid gap-3">
          {availableThemes.map(themeName => (
            <div key={themeName} onClick={() => setTheme(themeName)}>
              <ThemePreview
                themeName={themeName}
                isSelected={currentTheme === themeName}
              />
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500">
        Changes are saved automatically and apply instantly.
      </div>
    </div>
  )
}
