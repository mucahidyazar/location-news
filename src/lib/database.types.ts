export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      locations: {
        Row: {
          id: string
          name: string
          latitude: number
          longitude: number
          country: string | null
          region: string | null
          news_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          latitude: number
          longitude: number
          country?: string | null
          region?: string | null
          news_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          latitude?: number
          longitude?: number
          country?: string | null
          region?: string | null
          news_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_categories: {
        Row: {
          id: string
          name: string
          color: string
          key: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          key?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          key?: string | null
          created_at?: string
        }
        Relationships: []
      }
      news_sources: {
        Row: {
          id: string
          name: string
          url: string | null
          logo_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          url?: string | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          url?: string | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          id: string
          title: string
          content: string
          summary: string | null
          location_id: string | null
          category_id: string | null
          source_id: string | null
          external_url: string | null
          image_url: string | null
          published_at: string
          scraped_at: string
          is_featured: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          summary?: string | null
          location_id?: string | null
          category_id?: string | null
          source_id?: string | null
          external_url?: string | null
          image_url?: string | null
          published_at: string
          scraped_at?: string
          is_featured?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          summary?: string | null
          location_id?: string | null
          category_id?: string | null
          source_id?: string | null
          external_url?: string | null
          image_url?: string | null
          published_at?: string
          scraped_at?: string
          is_featured?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "news_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "news_sources"
            referencedColumns: ["id"]
          }
        ]
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string | null
          preferred_locations: string[]
          preferred_categories: string[]
          notification_settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          preferred_locations?: string[]
          preferred_categories?: string[]
          notification_settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          preferred_locations?: string[]
          preferred_categories?: string[]
          notification_settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_analytics: {
        Row: {
          id: string
          news_id: string | null
          event_type: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          created_at: string
        }
        Insert: {
          id?: string
          news_id?: string | null
          event_type: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          news_id?: string | null
          event_type?: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_analytics_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_news_view_count: {
        Args: {
          news_uuid: string
        }
        Returns: undefined
      }
      safe_increment_news_view: {
        Args: {
          news_uuid: string
          user_ip?: string
          user_agent_string?: string
          referrer_url?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types for easier usage
export type Location = Database['public']['Tables']['locations']['Row']
export type LocationInsert = Database['public']['Tables']['locations']['Insert']
export type LocationUpdate = Database['public']['Tables']['locations']['Update']

export type NewsCategory = Database['public']['Tables']['news_categories']['Row']
export type NewsCategoryInsert = Database['public']['Tables']['news_categories']['Insert']
export type NewsCategoryUpdate = Database['public']['Tables']['news_categories']['Update']

export type NewsSource = Database['public']['Tables']['news_sources']['Row']
export type NewsSourceInsert = Database['public']['Tables']['news_sources']['Insert']
export type NewsSourceUpdate = Database['public']['Tables']['news_sources']['Update']

export type News = Database['public']['Tables']['news']['Row']
export type NewsInsert = Database['public']['Tables']['news']['Insert']
export type NewsUpdate = Database['public']['Tables']['news']['Update']

export type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
export type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert']
export type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update']

export type NewsAnalytics = Database['public']['Tables']['news_analytics']['Row']
export type NewsAnalyticsInsert = Database['public']['Tables']['news_analytics']['Insert']
export type NewsAnalyticsUpdate = Database['public']['Tables']['news_analytics']['Update']

// Extended types with relationships
export type NewsWithRelations = News & {
  location?: Location
  category?: NewsCategory
  source?: NewsSource
}

export type LocationWithStats = Location & {
  primary_category?: string
  latest_news_count?: number
}