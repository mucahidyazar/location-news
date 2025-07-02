'use client'

import React from 'react'
import Image from 'next/image'
import {useTheme} from '@/contexts/theme-context'

import {UserProfile} from '@/lib/types/user'

interface UserAvatarProps {
  userProfile: UserProfile | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'round' | 'square'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-20 h-20 text-xl',
}

// Generate consistent color based on user's name/email
const generateThemeColor = (text: string, palette: unknown) => {
  const hash = text.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  // Fallback colors if palette is not available
  const fallbackColors = [
    '#0ea5e9',
    '#8b5cf6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#06b6d4',
  ]

  if (!palette || typeof palette !== 'object' || !('primary' in palette) || !('secondary' in palette)) {
    return fallbackColors[Math.abs(hash) % fallbackColors.length]
  }

  const paletteObj = palette as Record<string, Record<string, string>>
  const colors = [
    paletteObj.primary?.['500'],
    paletteObj.secondary?.['500'],
    paletteObj.primary?.['600'],
    paletteObj.secondary?.['600'],
    paletteObj.primary?.['400'],
    paletteObj.secondary?.['400'],
  ].filter(Boolean)

  return colors.length > 0 ? colors[Math.abs(hash) % colors.length] : fallbackColors[Math.abs(hash) % fallbackColors.length]
}

export function UserAvatar({
  userProfile,
  size = 'md',
  shape = 'round',
  className = '',
}: UserAvatarProps) {
  let palette
  try {
    const theme = useTheme()
    palette = theme?.palette
  } catch {
    console.warn('Theme context not available, using fallback colors')
    palette = null
  }

  if (!userProfile) {
    return (
      <div
        className={`${sizeClasses[size]} ${
          shape === 'round' ? 'rounded-full' : 'rounded-lg'
        } bg-gray-300 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-600 font-medium">?</span>
      </div>
    )
  }

  const displayName = userProfile.full_name || userProfile.email || 'User'
  const initials = displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const backgroundColor = generateThemeColor(displayName, palette)
  const roundedClass = shape === 'round' ? 'rounded-full' : 'rounded-lg'

  const getImageSize = () => {
    switch (size) {
      case 'sm':
        return 32
      case 'md':
        return 40
      case 'lg':
        return 64
      case 'xl':
        return 80
      default:
        return 40
    }
  }

  if (userProfile.avatar_url) {
    return (
      <div
        className={`${sizeClasses[size]} ${roundedClass} overflow-hidden border-2 ${className}`}
        style={{borderColor: backgroundColor}}
      >
        <Image
          src={userProfile.avatar_url}
          alt={displayName}
          width={getImageSize()}
          height={getImageSize()}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} ${roundedClass} flex items-center justify-center font-medium text-white ${className}`}
      style={{backgroundColor}}
    >
      {initials}
    </div>
  )
}
