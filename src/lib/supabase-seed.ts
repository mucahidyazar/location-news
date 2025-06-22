import { supabaseAdmin } from './supabase'
import { 
  createLocation, 
  createNews, 
  getCategoryByName, 
  getSourceByName,
  getLocationByName
} from './supabase-helpers'
import type { NewsInsert } from './database.types'
import turkishNewsData from '../data/turkish-news-data.json'

// Use Turkish news data from JSON file
const { categories: newsCategories, locations: sampleLocations, sources: sampleSources, news: turkishNews } = turkishNewsData

export async function seedSupabaseDatabase() {
  console.log('🌱 Starting Supabase database seeding...')
  
  try {
    // 1. Seed categories first
    console.log('📂 Seeding news categories...')
    for (const category of newsCategories) {
      const { error } = await supabaseAdmin
        .from('news_categories')
        .upsert({
          name: category.name,
          color: category.color,
          key: category.key
        })
      
      if (error) {
        console.error(`Error seeding category ${category.name}:`, error)
      } else {
        console.log(`✅ Seeded category: ${category.name} (key: ${category.key})`)
      }
    }

    // 2. Seed sources
    console.log('📡 Seeding news sources...')
    for (const source of sampleSources) {
      const { error } = await supabaseAdmin
        .from('news_sources')
        .upsert(source)
      
      if (error) {
        console.error(`Error seeding source ${source.name}:`, error)
      } else {
        console.log(`✅ Seeded source: ${source.name}`)
      }
    }

    // 3. Seed locations
    console.log('🌍 Seeding locations...')
    const locationIds: Record<string, string> = {}
    
    for (const location of sampleLocations) {
      try {
        const createdLocation = await createLocation(location)
        locationIds[location.name] = createdLocation.id
        console.log(`✅ Seeded location: ${location.name}`)
      } catch (error) {
        console.error(`Error seeding location ${location.name}:`, error)
      }
    }

    // 4. Seed Turkish news
    console.log('📰 Seeding Turkish news articles...')
    let totalNews = 0
    
    for (const newsData of turkishNews) {
      try {
        // Get location ID
        const location = await getLocationByName(newsData.location)
        if (!location) {
          console.warn(`⚠️ Location not found: ${newsData.location}`)
          continue
        }
        
        // Get category and source IDs
        const category = await getCategoryByName(newsData.category)
        const source = await getSourceByName(newsData.source)
        
        // Calculate published date based on hours ago
        const publishedDate = new Date(Date.now() - (newsData.published_hours_ago * 60 * 60 * 1000))
        
        const newsInsert: NewsInsert = {
          title: newsData.title,
          content: newsData.content,
          summary: newsData.summary,
          location_name: location.name,
          latitude: location.latitude,
          longitude: location.longitude,
          category_id: category?.id,
          source_id: source?.id,
          published_at: publishedDate.toISOString(),
          is_featured: newsData.is_featured,
          external_url: newsData.external_url,
          image_url: newsData.image_url
        }
        
        await createNews(newsInsert)
        totalNews++
        
        if (totalNews % 5 === 0) {
          console.log(`📊 Progress: ${totalNews}/${turkishNews.length} news items seeded`)
        }
      } catch (error) {
        console.error(`Error seeding news "${newsData.title}":`, error)
      }
    }

    console.log(`🎉 Turkish news database seeding completed!`)
    console.log(`📊 Summary:`)
    console.log(`   - Categories: ${newsCategories.length}`)
    console.log(`   - Locations: ${Object.keys(locationIds).length}`)
    console.log(`   - Sources: ${sampleSources.length}`)
    console.log(`   - Turkish News articles: ${totalNews}`)
    
    return {
      success: true,
      stats: {
        categories: newsCategories.length,
        locations: Object.keys(locationIds).length,
        sources: sampleSources.length,
        news: totalNews
      }
    }
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    throw error
  }
}