/**
 * Migration script to transfer data from SQLite to Supabase
 * Run this script to migrate your existing data
 */

import { createClient } from '@supabase/supabase-js'
import Database from 'better-sqlite3'
import { join } from 'path'
import type { Database as DatabaseType } from '../lib/database.types'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<DatabaseType>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// SQLite database
const sqliteDb = new Database(join(process.cwd(), 'data.db'))

interface SQLiteLocation {
  id: number
  name: string
  latitude: number
  longitude: number
  newsCount: number
}

interface SQLiteNews {
  id: number
  title: string
  content: string
  location: string
  latitude: number
  longitude: number
  category: string
  published_at: string
  source: string
  imageUrl?: string
}

async function migrateCategories() {
  console.log('🏷️ Migrating categories...')

  // Get unique categories from SQLite
  const categories = sqliteDb.prepare(`
    SELECT DISTINCT category FROM news WHERE category IS NOT NULL
  `).all() as { category: string }[]

  // Default category colors
  const categoryColors: Record<string, string> = {
    'Politics': '#EF4444',
    'Business': '#10B981',
    'Technology': '#3B82F6',
    'Health': '#F59E0B',
    'Sports': '#8B5CF6',
    'Entertainment': '#EC4899',
    'Science': '#06B6D4',
    'Environment': '#84CC16',
    'Crime': '#DC2626',
    'Education': '#7C3AED'
  }

  for (const { category } of categories) {
    const { error } = await supabase
      .from('news_categories')
      .upsert({
        name: category,
        color: categoryColors[category] || '#6B7280'
      })

    if (error) {
      console.error(`❌ Error migrating category ${category}:`, error)
    } else {
      console.log(`✅ Migrated category: ${category}`)
    }
  }
}

async function migrateSources() {
  console.log('📡 Migrating sources...')

  // Get unique sources from SQLite
  const sources = sqliteDb.prepare(`
    SELECT DISTINCT source FROM news WHERE source IS NOT NULL
  `).all() as { source: string }[]

  for (const { source } of sources) {
    const { error } = await supabase
      .from('news_sources')
      .upsert({
        name: source,
        is_active: true
      })

    if (error) {
      console.error(`❌ Error migrating source ${source}:`, error)
    } else {
      console.log(`✅ Migrated source: ${source}`)
    }
  }
}

async function migrateLocations() {
  console.log('🌍 Migrating locations...')

  const locations = sqliteDb.prepare(`
    SELECT * FROM locations
  `).all() as SQLiteLocation[]

  for (const location of locations) {
    const { error } = await supabase
      .from('locations')
      .upsert({
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        news_count: location.newsCount
      })

    if (error) {
      console.error(`❌ Error migrating location ${location.name}:`, error)
    } else {
      console.log(`✅ Migrated location: ${location.name}`)
    }
  }
}

async function migrateNews() {
  console.log('📰 Migrating news...')

  const news = sqliteDb.prepare(`
    SELECT * FROM news
  `).all() as SQLiteNews[]

  console.log(`Found ${news.length} news items to migrate`)

  // Get location and category mappings
  const { data: locations } = await supabase
    .from('locations')
    .select('id, name')

  const { data: categories } = await supabase
    .from('news_categories')
    .select('id, name')

  const { data: sources } = await supabase
    .from('news_sources')
    .select('id, name')

  const locationMap = new Map(locations?.map(l => [l.name, l.id]))
  const categoryMap = new Map(categories?.map(c => [c.name, c.id]))
  const sourceMap = new Map(sources?.map(s => [s.name, s.id]))

  let migrated = 0
  let failed = 0

  for (const newsItem of news) {
    try {
      const locationId = locationMap.get(newsItem.location)
      const categoryId = categoryMap.get(newsItem.category)
      const sourceId = sourceMap.get(newsItem.source)

      if (!locationId) {
        console.warn(`⚠️ Location not found: ${newsItem.location}`)
        failed++
        continue
      }

      const { error } = await supabase
        .from('news')
        .insert({
          title: newsItem.title,
          content: newsItem.content,
          location_id: locationId,
          category_id: categoryId,
          source_id: sourceId,
          image_url: newsItem.imageUrl,
          published_at: newsItem.published_at
        })

      if (error) {
        console.error(`❌ Error migrating news "${newsItem.title}":`, error)
        failed++
      } else {
        migrated++
        if (migrated % 10 === 0) {
          console.log(`📊 Progress: ${migrated}/${news.length} news items migrated`)
        }
      }
    } catch (error) {
      console.error(`❌ Error processing news "${newsItem.title}":`, error)
      failed++
    }
  }

  console.log(`✅ Migration complete: ${migrated} successful, ${failed} failed`)
}

async function main() {
  try {
    console.log('🚀 Starting migration from SQLite to Supabase...')

    // Check if SQLite database exists
    try {
      sqliteDb.prepare('SELECT 1').get()
    } catch {
      console.error('❌ SQLite database not found. Make sure data.db exists.')
      process.exit(1)
    }

    // Test Supabase connection
    const { error } = await supabase.from('locations').select('count').limit(1)
    if (error) {
      console.error('❌ Cannot connect to Supabase:', error)
      process.exit(1)
    }

    console.log('✅ Connected to both databases')

    // Run migrations in order
    await migrateCategories()
    await migrateSources()
    await migrateLocations()
    await migrateNews()

    console.log('🎉 Migration completed successfully!')

    // Cleanup
    sqliteDb.close()

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
if (require.main === module) {
  main()
}