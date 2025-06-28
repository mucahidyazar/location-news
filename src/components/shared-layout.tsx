'use client'

import React from 'react'
import CommonHeader from '@/components/common-header'
import {useTranslations} from 'next-intl'

interface SharedLayoutProps {
  children: React.ReactNode
  className?: string
  headerProps?: {
    title?: string
    subtitle?: string
    className?: string
    showLanguageSwitcher?: boolean
    showMapControls?: boolean
    showNewsButton?: boolean
    showSidebarButton?: boolean
    useCustomIcons?: boolean
    onToggleIcons?: () => void
    onToggleSidebar?: () => void
    rightContent?: React.ReactNode
  }
}

export default function SharedLayout({
  children,
  className = 'min-h-screen bg-gray-50',
  headerProps = {}
}: SharedLayoutProps) {
  const t = useTranslations()

  const defaultHeaderProps = {
    title: t('header.title'),
    subtitle: t('header.subtitle'),
    showLanguageSwitcher: true,
    showMapControls: false,
    showNewsButton: true,
    showSidebarButton: false,
    ...headerProps
  }

  return (
    <div className={className}>
      <CommonHeader {...defaultHeaderProps} />
      {children}
    </div>
  )
}