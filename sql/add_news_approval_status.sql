-- Extend existing status field for news approval workflow
-- This migration modifies the existing status field to include approval states

-- First, drop the existing constraint
ALTER TABLE news DROP CONSTRAINT IF EXISTS news_status_check;

-- Update the status column constraint to include approval states
ALTER TABLE news ADD CONSTRAINT news_status_check 
CHECK (status IN ('active', 'resolved', 'ongoing', 'pending', 'approved', 'rejected', 'archived'));

-- Add columns for tracking submitter and admin actions
ALTER TABLE news ADD COLUMN IF NOT EXISTS submitted_by_email TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS processed_by_admin_id UUID REFERENCES auth.users(id);
ALTER TABLE news ADD COLUMN IF NOT EXISTS status_notes TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMPTZ;

-- Update existing news to be 'approved' by default (since they're already live)
-- Keep existing status values, but change 'active' to 'approved' for clarity
UPDATE news SET status = 'approved' WHERE status = 'active';

-- Create index for finding news by submitter email
CREATE INDEX IF NOT EXISTS idx_news_submitted_by_email ON news(submitted_by_email);

-- Update comments to explain the status field usage
COMMENT ON COLUMN news.status IS 'News status: pending (waiting for admin approval), approved (live), rejected (denied), resolved (issue resolved), ongoing (still active), archived (old news removed from active view)';
COMMENT ON COLUMN news.submitted_by_email IS 'Email of the user who submitted this news (for user-generated content)';
COMMENT ON COLUMN news.processed_by_admin_id IS 'ID of the admin who last changed the status of this news';
COMMENT ON COLUMN news.status_notes IS 'Notes from admin about the status change (approval, rejection, archiving, etc.)';
COMMENT ON COLUMN news.status_changed_at IS 'Date when the status was last changed by an admin';