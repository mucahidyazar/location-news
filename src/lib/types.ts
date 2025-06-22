// Common types used across the application

export interface NewsItem {
  id?: string | number
  title: string
  content: string
  summary?: string | null
  published_at?: string
  publishedAt?: string // Legacy support
  image_url?: string | null
  imageUrl?: string | null // Legacy support
  external_url?: string | null
  externalUrl?: string | null // Legacy support
  is_featured?: boolean
  view_count?: number
  location_name?: string | null
  location?: string | { id?: string; name: string } | null // Legacy support
  latitude?: number | null
  longitude?: number | null
  category?: {
    id?: string
    name: string
    color?: string
  } | string | null // Support both new object format and legacy string format
  source?: {
    id?: string
    name: string
  } | string | null // Support both new object format and legacy string format
}

// Legacy format for backward compatibility
export interface LegacyNewsItem {
  id: string | number
  title: string
  content: string
  location: string
  latitude: number
  longitude: number
  category: string
  publishedAt: string
  source: string
  imageUrl?: string | null
  externalUrl?: string | null
}

export interface Location {
  id: string | number
  name: string
  latitude: number
  longitude: number
  news_count?: number
  newsCount?: number // Legacy support
  primary_category?: string
  primaryCategory?: string // Legacy support
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  color: string
  created_at?: string
  updated_at?: string
}

export interface Source {
  id: string
  name: string
  type?: string
  url?: string | null
  status?: string
  created_at?: string
  updated_at?: string
}

// Common props interfaces
export interface NewsCardProps {
  news: NewsItem
  onLocationClick?: (location: string) => void
}

export interface DateRange {
  start?: string
  end?: string
}

export interface FilterOptions {
  selectedLocation?: string
  selectedCategories: string[]
  selectedSources: string[]
  dateRange: DateRange
  searchTerm: string
  featuredOnly?: boolean
}