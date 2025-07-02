export interface Database {
  public: {
    Tables: {
      locations: {
        Row: Location
        Insert: LocationInsert
        Update: Partial<LocationInsert>
      }
      news: {
        Row: News
        Insert: NewsInsert
        Update: Partial<NewsInsert>
      }
      news_categories: {
        Row: NewsCategory
        Insert: Omit<NewsCategory, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<NewsCategory, 'id' | 'created_at' | 'updated_at'>>
      }
      news_sources: {
        Row: NewsSource
        Insert: Omit<NewsSource, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<NewsSource, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Base types for our entities
export interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  country?: string
  region?: string
  news_count?: number
  created_at: string
  updated_at: string
}

export interface LocationInsert {
  id?: string
  name: string
  latitude: number
  longitude: number
  country?: string
  region?: string
  news_count?: number
}

export interface LocationWithStats extends Location {
  news_count: number
  primary_category: string
}

export interface NewsCategory {
  id: string
  name: string
  color: string
  key: string
  created_at: string
  updated_at: string
}

export interface NewsSource {
  id: string
  name: string
  url?: string
  created_at: string
  updated_at: string
}

export interface News {
  id: string
  title: string
  content?: string
  location_name?: string
  latitude?: number
  longitude?: number
  category_id?: string
  source_id?: string
  image_url?: string
  external_url?: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface NewsInsert {
  title: string
  content?: string
  summary?: string
  location_name?: string
  latitude?: number
  longitude?: number
  category_id?: string
  source_id?: string
  image_url?: string
  external_url?: string
  published_at?: string
  is_featured?: boolean
}

export interface NewsWithRelations extends News {
  category?: NewsCategory
  source?: NewsSource
}