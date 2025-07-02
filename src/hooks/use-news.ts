import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { NewsItem, Category } from '@/lib/types'

interface UseNewsOptions {
  searchTerm?: string
  selectedCategory?: string
  limit?: number
}

interface UseInfiniteNewsOptions {
  searchTerm?: string
  selectedCategory?: string
  limit?: number
}

export function useNews({ searchTerm, selectedCategory, limit = 20 }: UseNewsOptions = {}) {
  return useQuery({
    queryKey: ['news', searchTerm, selectedCategory, limit],
    queryFn: async (): Promise<NewsItem[]> => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: '0',
      })

      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)

      const response = await fetch(`/api/news?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }
      return response.json()
    },
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useInfiniteNews({ searchTerm, selectedCategory, limit = 20 }: UseInfiniteNewsOptions = {}) {
  return useInfiniteQuery({
    queryKey: ['infinite-news', searchTerm, selectedCategory, limit],
    queryFn: async ({ pageParam = 0 }): Promise<NewsItem[]> => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (pageParam as number).toString(),
      })

      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)

      const response = await fetch(`/api/news?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }
      return response.json()
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Eğer son sayfa tam dolu değilse (limit'den az), daha fazla veri yok
      if ((lastPage as NewsItem[]).length < limit) {
        return undefined
      }
      // Sonraki sayfa için offset hesapla
      return allPages.length * limit
    },
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Admin news reports için interface
export interface AdminNewsItem {
  id: string
  title: string
  content?: string
  location_name: string
  latitude?: number
  longitude?: number
  category_id: string
  category?: {
    id: string
    name: string
  }
  submitted_by_email: string
  external_url: string
  image_url?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  status_notes?: string
}

interface UseInfiniteAdminNewsOptions {
  status?: 'pending' | 'approved' | 'rejected'
  searchTerm?: string
  limit?: number
}

export function useInfiniteAdminNews({ status, searchTerm, limit = 20 }: UseInfiniteAdminNewsOptions = {}) {
  // QueryKey'i normalize et
  const normalizedStatus = status || 'all'
  const normalizedSearchTerm = searchTerm?.trim() || ''
  
  return useInfiniteQuery({
    queryKey: ['infinite-admin-news', normalizedStatus, normalizedSearchTerm, limit],
    queryFn: async ({ pageParam = 0 }): Promise<AdminNewsItem[]> => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (pageParam as number).toString(),
      })

      if (status) params.append('status', status)
      if (searchTerm && searchTerm.trim()) params.append('search', searchTerm.trim())

      const response = await fetch(`/api/admin/news-reports?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch admin news reports')
      }
      return response.json()
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Eğer son sayfa tam dolu değilse (limit'den az), daha fazla veri yok
      if ((lastPage as AdminNewsItem[]).length < limit) {
        return undefined
      }
      // Sonraki sayfa için offset hesapla
      return allPages.length * limit
    },
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 seconds
    // Cache'i daha agresif tutarak gereksiz istekleri önle
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const response = await fetch('/api/categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      return response.json()
    },
  })
}