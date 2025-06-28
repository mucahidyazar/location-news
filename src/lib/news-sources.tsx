import Image from 'next/image'
import React from 'react'

export const newsSourceLogos: Record<string, string> = {
  'Reuters': '📰',
  'AP News': '🗞️',
  'BBC News': '📺',
  'CNN': '📡',
  'TRT Haber': '📻',
  'France24': '🇫🇷',
  'Deutsche Welle': '🇩🇪',
  'Al Jazeera': '🌍',
  'Sky News': '🛰️',
  'Euronews': '🇪🇺',
  'Associated Press': '📃',
  'Bloomberg': '💼',
  'Financial Times': '💰',
  'Wall Street Journal': '💵',
  'Guardian': '🇬🇧',
  'NTV': '📺',
  'IHA': '📰',
  'AA': '🇹🇷',
  'Anadolu Ajansı': '🇹🇷',
  'Hürriyet': '📰',
  'Habertürk': '📺',
  'Milliyet': '🗞️',
  'Sabah': '📰',
  'Cumhuriyet': '📃',
  'Hürriyet Daily News': '🌐'
}

export function getSourceLogo(source: string): string {
  return newsSourceLogos[source] || '📰'
}

interface SourceLogoProps {
  source: { name: string; logo_url?: string | null } | string | null | undefined
  className?: string
}

export function SourceLogo({ source, className = 'w-4 h-4' }: SourceLogoProps): React.ReactElement {
  if (!source) {
    return <span className={className}>📰</span>
  }
  
  const sourceName = typeof source === 'string' ? source : source.name
  const logoUrl = typeof source === 'string' ? null : source.logo_url

  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={sourceName}
        width={16}
        height={16}
        className={className}
      />
    )
  }

  return <span className={className}>{getSourceLogo(sourceName)}</span>
}