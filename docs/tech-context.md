# Technical Context

## Architecture Overview

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 for utility-first styling
- **UI Components**: shadcn/ui for consistent, accessible components
- **Database**: SQLite with better-sqlite3 for lightweight, local data storage
- **Map Library**: Leaflet + React-Leaflet for interactive mapping
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns + react-day-picker for date operations

## Project Structure

```
mappy.news/
├── src/
│   ├── app/             # Next.js app directory (routes, layouts, pages)
│   ├── components/      # Reusable UI components
│   ├── lib/            # Utilities and database logic
│   └── types/          # TypeScript type definitions
├── public/             # Static assets (images, icons, manifest)
├── docs/               # Project documentation
├── data/               # SQLite database and seed data
└── .cursor/            # Cursor IDE configuration
```

## Key Dependencies

- `next`: React framework (v15)
- `tailwindcss`: CSS framework (v4)
- `@radix-ui/*`: Accessibility primitives for shadcn/ui
- `lucide-react`: Icon library
- `better-sqlite3`: Database driver
- `leaflet` + `react-leaflet`: Interactive mapping
- `date-fns`: Date utility library
- `react-day-picker`: Date picker component

## Data Model

```sql
CREATE TABLE news_articles (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  published_at DATETIME,
  source TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Development Workflow

1. ✅ Set up Next.js project with TypeScript
2. ✅ Configure Tailwind CSS and shadcn/ui
3. ✅ Create database schema and seed data
4. ✅ Build map component with Leaflet markers
5. ✅ Implement advanced news filtering and sidebar
6. ✅ Add responsive design and polish
7. ✅ SEO optimization (metadata, sitemap, robots.txt)
8. ✅ PWA setup (app icons, manifest)
9. ✅ Production optimization (security headers, error handling)
10. 🔧 Deployment and final testing
