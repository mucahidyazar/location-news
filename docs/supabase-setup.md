# Supabase Database Setup for mappy.news

## 📋 Overview

This document provides step-by-step instructions to set up your Supabase
database for the mappy.news application.

## 🚀 Quick Setup Steps

### 1. Execute Database Schema

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to create all tables, indexes, and functions

### 2. Apply Security Policies

1. In the same SQL Editor
2. Copy and paste the contents of `supabase-rls-policies.sql`
3. Click **Run** to enable Row Level Security and policies

### 3. Verify Installation

Check that these tables were created:

- ✅ `locations`
- ✅ `news_categories` (with default categories)
- ✅ `news_sources`
- ✅ `news`
- ✅ `user_preferences`
- ✅ `news_analytics`

## 📊 Database Schema Overview

### Core Tables

#### 🌍 `locations`

- Stores geographic locations for news
- Auto-updates news count via triggers
- Supports country/region categorization

#### 📰 `news`

- Main news articles table
- Links to locations, categories, and sources
- Supports full-text search
- Tracks view counts and featured status

#### 🏷️ `news_categories`

- Pre-populated with common news categories
- Each category has a color for UI theming
- Categories: Politics, Business, Technology, Health, Sports, etc.

#### 📡 `news_sources`

- Manages news source information
- Supports source logos and active/inactive status
- Can track source reliability metrics

#### 👤 `user_preferences`

- User-specific settings (for future auth integration)
- Preferred locations and categories
- Notification preferences

#### 📈 `news_analytics`

- Tracks user interactions (views, clicks, shares)
- Rate-limited to prevent spam
- Anonymous and authenticated tracking

### Key Features

#### 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Public read access for news content
- Rate-limited view tracking
- Service role access for admin operations

#### ⚡ Performance

- Optimized indexes for common queries
- Full-text search on news content
- Automatic location news count updates
- Efficient pagination support

#### 🔄 Auto-Updates

- Automatic timestamp management
- Location news count triggers
- View count increment functions

## 🛠️ API Integration

### Updated Files

- `src/lib/supabase.ts` - Enhanced with TypeScript types
- `src/lib/database.types.ts` - Complete type definitions
- `src/lib/supabase-helpers.ts` - Helper functions for common operations

### Available Functions

#### Location Functions

```typescript
getLocations() // Get all locations with stats
getLocationByName(name) // Find location by name
createLocation(location) // Create new location
```

#### News Functions

```typescript
getNews(params) // Get news with filtering
getNewsById(id) // Get single news item
createNews(news) // Create new news item
incrementNewsView(id) // Track news views
searchNews(query) // Full-text search
```

#### Category & Source Functions

```typescript
getCategories() // Get all categories
getCategoryByName(name) // Find category
getSources() // Get active sources
getSourceByName(name) // Find source
```

## 🔄 Migration from SQLite

### Data Migration Steps

1. Export your existing SQLite data
2. Transform data to match new schema:
   - Convert location strings to location IDs
   - Map categories to category IDs
   - Add source information
3. Use the helper functions to insert data
4. Update your API routes to use Supabase helpers

### Code Updates Needed

- Update API routes (`src/app/api/*/route.ts`)
- Replace SQLite database calls with Supabase helpers
- Update TypeScript interfaces to use new types
- Add proper error handling for async operations

## 🎯 Next Steps

1. **Execute the SQL files** in your Supabase dashboard
2. **Test the setup** by checking tables in the Table Editor
3. **Update your API routes** to use Supabase instead of SQLite
4. **Migrate existing data** if you have any
5. **Add authentication** for user preferences (optional)
6. **Set up real-time subscriptions** for live news updates (optional)

## 🆘 Troubleshooting

### Common Issues

- **Permission denied**: Make sure you're using the service role key for admin
  operations
- **Foreign key constraints**: Ensure locations and categories exist before
  creating news
- **RLS blocking queries**: Check that policies are correctly applied

### Useful Queries

```sql
-- Check table creation
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- View RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Count records
SELECT 'locations' as table, count(*) from locations
UNION ALL
SELECT 'news_categories' as table, count(*) from news_categories
UNION ALL
SELECT 'news' as table, count(*) from news;
```

## 📝 Notes

- The schema supports both anonymous and authenticated users
- All timestamps are in UTC
- View tracking includes rate limiting to prevent abuse
- The database is optimized for read-heavy workloads typical of news
  applications
