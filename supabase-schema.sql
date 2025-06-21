-- Location-News Database Schema for Supabase
-- Execute this in your Supabase SQL Editor

-- =============================================
-- 1. LOCATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS locations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  country text,
  region text,
  news_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for locations
CREATE INDEX IF NOT EXISTS idx_locations_name ON locations(name);
CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_locations_country ON locations(country);

-- =============================================
-- 2. NEWS CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS news_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  key text UNIQUE NOT NULL,
  color text DEFAULT '#6B7280',
  icon text DEFAULT 'newspaper-sharp',
  created_at timestamptz DEFAULT now()
);

-- Insert crime categories
INSERT INTO news_categories (name, key, color, icon) VALUES
  ('Theft & Robbery', 'theft_robbery', '#DC2626', 'mask'),
  ('Fraud & Scam', 'fraud_scam', '#B91C1C', 'credit-card'),
  ('Violence', 'violence', '#991B1B', 'angry-man'),
  ('Sexual Crimes', 'sexual_crimes', '#7F1D1D', 'shield-star'),
  ('Traffic Incidents', 'traffic_incidents', '#EF4444', 'car-crash'),
  ('Drug Crimes', 'drug_crimes', '#F59E0B', 'drug'),
  ('Domestic Violence', 'domestic_violence', '#DC2626', 'family'),
  ('Fire & Explosion', 'fire_explosion', '#EA580C', 'fire-and-explosion'),
  ('Suicide & Missing', 'suicide_missing', '#6B7280', 'magnify'),
  ('Terror & Security', 'terror_security', '#7C2D12', 'pistol'),
  ('Natural Disaster', 'natural_disaster', '#0891B2', 'storm'),
  ('Other Incidents', 'other_incidents', '#6B7280', 'newspaper-sharp')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 3. NEWS SOURCES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS news_sources (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  url text,
  logo_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- 4. NEWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS news (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  summary text,
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  category_id uuid REFERENCES news_categories(id) ON DELETE SET NULL,
  source_id uuid REFERENCES news_sources(id) ON DELETE SET NULL,
  external_url text,
  image_url text,
  published_at timestamptz NOT NULL,
  scraped_at timestamptz DEFAULT now(),
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for news
CREATE INDEX IF NOT EXISTS idx_news_location ON news(location_id);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_news_search ON news USING gin(to_tsvector('english', title || ' ' || content));

-- =============================================
-- 5. USER PREFERENCES TABLE (for future features)
-- =============================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid, -- Will be linked to auth.users later
  preferred_locations uuid[] DEFAULT '{}',
  preferred_categories uuid[] DEFAULT '{}',
  notification_settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- 6. NEWS ANALYTICS TABLE (for tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS news_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id uuid REFERENCES news(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'view', 'click', 'share'
  user_id uuid, -- anonymous or authenticated user
  ip_address inet,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Index for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_news ON news_analytics(news_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON news_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON news_analytics(created_at);

-- =============================================
-- 7. FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update location news count
CREATE OR REPLACE FUNCTION update_location_news_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE locations 
    SET news_count = news_count + 1,
        updated_at = now()
    WHERE id = NEW.location_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE locations 
    SET news_count = news_count - 1,
        updated_at = now()
    WHERE id = OLD.location_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' AND OLD.location_id != NEW.location_id THEN
    UPDATE locations 
    SET news_count = news_count - 1,
        updated_at = now()
    WHERE id = OLD.location_id;
    
    UPDATE locations 
    SET news_count = news_count + 1,
        updated_at = now()
    WHERE id = NEW.location_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for location news count
CREATE TRIGGER trigger_update_location_news_count
  AFTER INSERT OR UPDATE OR DELETE ON news
  FOR EACH ROW EXECUTE FUNCTION update_location_news_count();

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_news_sources_updated_at
  BEFORE UPDATE ON news_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_news_view_count(news_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE news 
  SET view_count = view_count + 1,
      updated_at = now()
  WHERE id = news_uuid;
  
  INSERT INTO news_analytics (news_id, event_type, created_at)
  VALUES (news_uuid, 'view', now());
END;
$$ LANGUAGE plpgsql;