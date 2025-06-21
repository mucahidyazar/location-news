-- Row Level Security (RLS) Policies for Location-News
-- Execute this AFTER creating the schema

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_analytics ENABLE ROW LEVEL SECURITY;

-- =============================================
-- LOCATIONS POLICIES
-- =============================================

-- Allow public read access to locations
CREATE POLICY "Allow public read access to locations" ON locations
  FOR SELECT USING (true);

-- Allow service role to manage locations
CREATE POLICY "Allow service role to manage locations" ON locations
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- NEWS CATEGORIES POLICIES
-- =============================================

-- Allow public read access to categories
CREATE POLICY "Allow public read access to categories" ON news_categories
  FOR SELECT USING (true);

-- Allow service role to manage categories
CREATE POLICY "Allow service role to manage categories" ON news_categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- NEWS SOURCES POLICIES
-- =============================================

-- Allow public read access to active sources
CREATE POLICY "Allow public read access to active sources" ON news_sources
  FOR SELECT USING (is_active = true);

-- Allow service role to manage sources
CREATE POLICY "Allow service role to manage sources" ON news_sources
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- NEWS POLICIES
-- =============================================

-- Allow public read access to all news
CREATE POLICY "Allow public read access to news" ON news
  FOR SELECT USING (true);

-- Allow service role to manage news
CREATE POLICY "Allow service role to manage news" ON news
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow authenticated users to update view count (via function)
CREATE POLICY "Allow view count updates" ON news
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- =============================================
-- USER PREFERENCES POLICIES
-- =============================================

-- Users can only see their own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own preferences
CREATE POLICY "Users can delete own preferences" ON user_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- NEWS ANALYTICS POLICIES
-- =============================================

-- Allow public insert for analytics (anonymous tracking)
CREATE POLICY "Allow public analytics insert" ON news_analytics
  FOR INSERT WITH CHECK (true);

-- Only service role can read analytics
CREATE POLICY "Service role can read analytics" ON news_analytics
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- ADDITIONAL SECURITY FUNCTIONS
-- =============================================

-- Function to safely log news view with rate limiting
CREATE OR REPLACE FUNCTION safe_increment_news_view(
  news_uuid uuid,
  user_ip inet DEFAULT NULL,
  user_agent_string text DEFAULT NULL,
  referrer_url text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  recent_view_count integer;
BEGIN
  -- Check for rate limiting (max 10 views per IP per news item per hour)
  SELECT COUNT(*) INTO recent_view_count
  FROM news_analytics
  WHERE news_id = news_uuid
    AND ip_address = COALESCE(user_ip, inet_client_addr())
    AND event_type = 'view'
    AND created_at > now() - interval '1 hour';

  -- If under rate limit, record the view
  IF recent_view_count < 10 THEN
    -- Update news view count
    UPDATE news 
    SET view_count = view_count + 1,
        updated_at = now()
    WHERE id = news_uuid;
    
    -- Insert analytics record
    INSERT INTO news_analytics (
      news_id, 
      event_type, 
      user_id, 
      ip_address, 
      user_agent, 
      referrer,
      created_at
    ) VALUES (
      news_uuid, 
      'view', 
      auth.uid(), 
      COALESCE(user_ip, inet_client_addr()),
      user_agent_string,
      referrer_url,
      now()
    );
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to public for the view function
GRANT EXECUTE ON FUNCTION safe_increment_news_view TO public;