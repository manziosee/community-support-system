-- Community Support System Database Migration v2.0
-- Adds UserSettings table and Request category field
-- Safe for both local and production environments

-- 1. Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    settings_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    email_notifications BOOLEAN NOT NULL DEFAULT true,
    push_notifications BOOLEAN NOT NULL DEFAULT true,
    request_updates BOOLEAN NOT NULL DEFAULT true,
    assignment_updates BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 2. Add category column to requests table
ALTER TABLE requests ADD COLUMN IF NOT EXISTS category VARCHAR(50) NOT NULL DEFAULT 'GENERAL_HELP';

-- 3. Create default user settings for existing users
INSERT INTO user_settings (user_id, email_notifications, push_notifications, request_updates, assignment_updates)
SELECT u.user_id, true, true, true, true
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM user_settings us WHERE us.user_id = u.user_id
);

-- 4. Update existing requests with default category if null
UPDATE requests 
SET category = 'GENERAL_HELP' 
WHERE category IS NULL OR category = '';

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_category ON requests(category);
CREATE INDEX IF NOT EXISTS idx_requests_status_category ON requests(status, category);

-- 6. Verify migration
DO $$
BEGIN
    -- Check if user_settings table exists and has data
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_settings') THEN
        RAISE NOTICE 'user_settings table created successfully';
        RAISE NOTICE 'user_settings records: %', (SELECT COUNT(*) FROM user_settings);
    END IF;
    
    -- Check if category column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'requests' AND column_name = 'category') THEN
        RAISE NOTICE 'requests.category column added successfully';
        RAISE NOTICE 'requests with categories: %', (SELECT COUNT(*) FROM requests WHERE category IS NOT NULL);
    END IF;
END $$;

-- Migration completed successfully