# mappy.news - Project Brief

## Overview

A news-on-map application that displays location-based news articles on an
interactive map interface.

## Core Features

- **Interactive Map**: Full-screen Leaflet map showing news markers by location
- **Advanced Filtering**: Filter by categories, sources, date ranges, and search
  terms
- **Multiple View Types**: Card, horizontal, and minimal news layouts
- **Smart Date Picker**: Quick date range selection with presets
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Dynamic news filtering and map updates
- **PWA Support**: App icons, manifest, and offline capabilities

## Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Database**: SQLite with better-sqlite3
- **Map**: Leaflet + React-Leaflet for interactive mapping
- **Icons**: Lucide React
- **Date Handling**: date-fns + react-day-picker

## User Experience

- Users see a full-screen map with news markers
- Clicking markers shows news details
- Right sidebar displays filtered news list
- Category filters allow focused browsing
- Responsive design for desktop and mobile

## Success Criteria

- ✅ Fast, responsive map interactions with Leaflet
- ✅ Intuitive news filtering and browsing with multiple view types
- ✅ Clean, modern UI using shadcn/ui components
- ✅ Proper data structure for location-based news
- ✅ SEO optimized with metadata, sitemap, and Open Graph tags
- ✅ Production-ready with error handling and security headers
- ✅ PWA capabilities with app icons and manifest
