# Technical Context

## Architecture Overview
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS for utility-first styling
- **UI Components**: shadcn/ui for consistent, accessible components
- **Database**: SQLite for lightweight, local data storage
- **Map Library**: TBD (likely Leaflet or Mapbox)

## Project Structure
```
location-news/
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── lib/                 # Utilities and database logic
├── data/               # SQLite database and seed data
├── types/              # TypeScript type definitions
└── docs/               # Project documentation
```

## Key Dependencies
- `next`: React framework
- `tailwindcss`: CSS framework
- `@radix-ui/*`: Accessibility primitives for shadcn/ui
- `lucide-react`: Icon library
- `sqlite3` or `better-sqlite3`: Database driver
- Map library (TBD)

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
1. Set up Next.js project with TypeScript
2. Configure Tailwind CSS and shadcn/ui
3. Create database schema and seed data
4. Build map component with markers
5. Implement news filtering and sidebar
6. Add responsive design and polish