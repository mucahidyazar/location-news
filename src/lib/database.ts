import Database from 'better-sqlite3';
import { join } from 'path';
import { NewsItem, Location } from './types';

let db: Database.Database | null = null;

function getDb() {
  if (!db) {
    db = new Database(join(process.cwd(), 'data.db'));
    db.pragma('journal_mode = WAL');

    // Initialize tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        location TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        category TEXT NOT NULL,
        published_at TEXT NOT NULL,
        source TEXT NOT NULL,
        image_url TEXT
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        news_count INTEGER DEFAULT 0
      )
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_news_location ON news(location);
      CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
      CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at);
    `);
  }
  return db;
}


export function getNews(params: { location?: string | null; category?: string | null; limit: number; offset: number }) {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM news 
    WHERE ($location IS NULL OR location = $location)
      AND ($category IS NULL OR category = $category)
    ORDER BY published_at DESC
    LIMIT $limit OFFSET $offset
  `);
  return stmt.all(params);
}

export function getLocations() {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT 
      l.*,
      (
        SELECT category 
        FROM news n 
        WHERE n.location = l.name 
        GROUP BY category 
        ORDER BY COUNT(*) DESC 
        LIMIT 1
      ) as primaryCategory
    FROM locations l 
    ORDER BY news_count DESC
  `);
  return stmt.all();
}

export function insertNews(news: {
  title: string;
  content: string;
  location: string;
  latitude: number;
  longitude: number;
  category: string;
  published_at: string;
  source: string;
  image_url?: string;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO news (title, content, location, latitude, longitude, category, published_at, source, image_url)
    VALUES (@title, @content, @location, @latitude, @longitude, @category, @published_at, @source, @image_url)
  `);
  return stmt.run(news);
}

export function insertLocation(location: {
  name: string;
  latitude: number;
  longitude: number;
  news_count?: number;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO locations (name, latitude, longitude, news_count)
    VALUES (@name, @latitude, @longitude, @news_count)
  `);
  return stmt.run(location);
}

export function updateLocationNewsCount(locationName: string) {
  const db = getDb();
  const stmt = db.prepare(`
    UPDATE locations 
    SET news_count = (SELECT COUNT(*) FROM news WHERE location = ?)
    WHERE name = ?
  `);
  return stmt.run(locationName, locationName);
}
