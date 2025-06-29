import { supabase, supabaseAdmin } from './supabase'
import type { 
  Location, 
  LocationInsert, 
  News, 
  NewsInsert, 
  NewsWithRelations,
  NewsCategory,
  NewsSource,
  LocationWithStats
} from './database.types'

// =============================================
// LOCATION FUNCTIONS
// =============================================

export async function getLocations(): Promise<LocationWithStats[]> {
  // Get aggregated location data from news table
  const { data, error } = await supabase
    .from('news')
    .select(`
      location_name,
      latitude,
      longitude
    `)
    .not('location_name', 'is', null)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)

  if (error) {
    console.error('Error fetching locations from news:', error)
    throw error
  }

  // Group by location and calculate stats
  const locationMap = new Map()
  data.forEach((news: {location_name: string | null; latitude: number | null; longitude: number | null}) => {
    const key = news.location_name
    if (!key || !news.latitude || !news.longitude) return
    
    if (!locationMap.has(key)) {
      locationMap.set(key, {
        id: key,
        name: news.location_name,
        latitude: news.latitude,
        longitude: news.longitude,
        news_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
    locationMap.get(key).news_count++
  })

  // Convert to array and sort by news count
  const locations = Array.from(locationMap.values()).sort((a, b) => b.news_count - a.news_count)

  return locations as LocationWithStats[]
}

export async function getLocationByName(name: string): Promise<Location | null> {
  // Get location data from news table since locations table no longer exists
  const { data, error } = await supabase
    .from('news')
    .select('location_name, latitude, longitude')
    .eq('location_name', name)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching location from news:', error)
    throw error
  }

  // Convert to Location format
  return {
    id: data.location_name || '',
    name: data.location_name || '',
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
    country: null,
    region: null,
    news_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as Location
}

export async function createLocation(location: LocationInsert): Promise<Location> {
  // Locations are now embedded in news records, so we don't create separate location records
  // This function now returns a virtual location object for compatibility
  const virtualLocation: Location = {
    id: location.name,
    name: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
    country: location.country || null,
    region: location.region || null,
    news_count: location.news_count || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  return virtualLocation
}

// =============================================
// NEWS FUNCTIONS
// =============================================

export async function getNews(params: {
  location?: string
  category?: string
  limit?: number
  offset?: number
  featured?: boolean
  startDate?: string
  endDate?: string
}): Promise<NewsWithRelations[]> {
  let query = supabase
    .from('news')
    .select(`
      *,
      category:news_categories(*),
      source:news_sources(*)
    `)
    .order('created_at', { ascending: false })

  if (params.location) {
    query = query.eq('location_name', params.location)
  }

  if (params.category) {
    query = query.eq('news_categories.name', params.category)
  }

  if (params.featured) {
    query = query.eq('is_featured', true)
  }

  if (params.startDate) {
    query = query.gte('created_at', params.startDate)
  }

  if (params.endDate) {
    query = query.lte('created_at', params.endDate)
  }

  if (params.limit) {
    query = query.limit(params.limit)
  }

  if (params.offset) {
    query = query.range(params.offset, (params.offset + (params.limit || 50)) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching news:', error)
    throw error
  }

  return data as NewsWithRelations[]
}

export async function getNewsById(id: string): Promise<NewsWithRelations | null> {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      category:news_categories(*),
      source:news_sources(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching news by id:', error)
    throw error
  }

  return data as NewsWithRelations
}

export async function createNews(news: NewsInsert): Promise<News> {
  const { data, error } = await supabaseAdmin
    .from('news')
    .insert(news)
    .select()
    .single()

  if (error) {
    console.error('Error creating news:', error)
    throw error
  }

  return data
}

export async function incrementNewsView(
  newsId: string,
  userIp?: string,
  userAgent?: string,
  referrer?: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc('safe_increment_news_view', {
    news_uuid: newsId,
    user_ip: userIp,
    user_agent_string: userAgent,
    referrer_url: referrer
  })

  if (error) {
    console.error('Error incrementing news view:', error)
    return false
  }

  return data
}

// =============================================
// CATEGORIES FUNCTIONS
// =============================================

export async function getCategories(): Promise<NewsCategory[]> {
  const { data, error } = await supabase
    .from('news_categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    throw error
  }

  return data
}

export async function getCategoryByName(name: string): Promise<NewsCategory | null> {
  const { data, error } = await supabase
    .from('news_categories')
    .select('*')
    .eq('name', name)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching category:', error)
    throw error
  }

  return data
}

export async function getCategoryByKey(key: string): Promise<NewsCategory | null> {
  const { data, error } = await supabase
    .from('news_categories')
    .select('*')
    .eq('key', key)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching category by key:', error)
    throw error
  }

  return data
}

// =============================================
// SOURCES FUNCTIONS
// =============================================

export async function getSources(): Promise<NewsSource[]> {
  const { data, error } = await supabase
    .from('news_sources')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching sources:', error)
    throw error
  }

  return data
}

export async function getSourceByName(name: string): Promise<NewsSource | null> {
  const { data, error } = await supabase
    .from('news_sources')
    .select('*')
    .eq('name', name)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching source:', error)
    throw error
  }

  return data
}

// =============================================
// SEARCH FUNCTIONS
// =============================================

export async function searchNews(
  query: string,
  limit: number = 20
): Promise<NewsWithRelations[]> {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      category:news_categories(*),
      source:news_sources(*)
    `)
    .textSearch('title', query, {
      type: 'websearch',
      config: 'english'
    })
    .limit(limit)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching news:', error)
    throw error
  }

  return data as NewsWithRelations[]
}

// =============================================
// ANALYTICS FUNCTIONS
// =============================================

export async function logNewsEvent(
  newsId: string,
  eventType: 'view' | 'click' | 'share',
  metadata?: {
    userId?: string
    ipAddress?: string
    userAgent?: string
    referrer?: string
  }
): Promise<void> {
  const { error } = await supabase
    .from('news_analytics')
    .insert({
      news_id: newsId,
      event_type: eventType,
      user_id: metadata?.userId,
      ip_address: metadata?.ipAddress,
      user_agent: metadata?.userAgent,
      referrer: metadata?.referrer
    })

  if (error) {
    console.error('Error logging news event:', error)
    throw error
  }
}