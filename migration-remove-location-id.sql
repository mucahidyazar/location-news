-- Migration: Remove location_id and add latitude/longitude directly to news table
-- Execute this in your Supabase SQL Editor

-- Step 1: Add latitude and longitude columns to news table
ALTER TABLE news 
ADD COLUMN latitude double precision,
ADD COLUMN longitude double precision,
ADD COLUMN location_name text;

-- Step 2: Migrate existing data from locations table to news table
UPDATE news 
SET 
  latitude = l.latitude,
  longitude = l.longitude,
  location_name = l.name
FROM locations l 
WHERE news.location_id = l.id;

-- Step 3: Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_news_coordinates ON news(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_news_location_name ON news(location_name);

-- Step 4: Drop the old foreign key constraint and location_id column
ALTER TABLE news DROP CONSTRAINT IF EXISTS news_location_id_fkey;
ALTER TABLE news DROP COLUMN IF EXISTS location_id;

-- Step 5: Update the location news count function to work with location_name
CREATE OR REPLACE FUNCTION update_location_news_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE locations 
    SET news_count = news_count + 1,
        updated_at = now()
    WHERE name = NEW.location_name;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE locations 
    SET news_count = news_count - 1,
        updated_at = now()
    WHERE name = OLD.location_name;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' AND OLD.location_name != NEW.location_name THEN
    UPDATE locations 
    SET news_count = news_count - 1,
        updated_at = now()
    WHERE name = OLD.location_name;
    
    UPDATE locations 
    SET news_count = news_count + 1,
        updated_at = now()
    WHERE name = NEW.location_name;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Remove the old index
DROP INDEX IF EXISTS idx_news_location;

-- Step 7: Update news table to make latitude, longitude NOT NULL for new records
-- (Keep existing NULL values for backward compatibility during migration)
-- ALTER TABLE news ALTER COLUMN latitude SET NOT NULL;
-- ALTER TABLE news ALTER COLUMN longitude SET NOT NULL;

COMMENT ON COLUMN news.latitude IS 'Latitude coordinate of the news location';
COMMENT ON COLUMN news.longitude IS 'Longitude coordinate of the news location';
COMMENT ON COLUMN news.location_name IS 'Human-readable location name';