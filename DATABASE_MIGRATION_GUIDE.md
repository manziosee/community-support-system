# 🗄️ Database Migration Guide

## 📋 Overview
This guide ensures both local and production databases are updated with the new schema changes for UserSettings entity and Request category field.

## 🆕 Schema Changes

### 1. New Table: `user_settings`
```sql
CREATE TABLE user_settings (
    settings_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    email_notifications BOOLEAN NOT NULL DEFAULT true,
    push_notifications BOOLEAN NOT NULL DEFAULT true,
    request_updates BOOLEAN NOT NULL DEFAULT true,
    assignment_updates BOOLEAN NOT NULL DEFAULT true,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 2. Updated Table: `requests`
```sql
ALTER TABLE requests ADD COLUMN IF NOT EXISTS category VARCHAR(50) NOT NULL DEFAULT 'GENERAL_HELP';
```

## 🛠️ Migration Steps

### For Local Development:

1. **Stop the application** if running
2. **Update application-dev.properties** temporarily:
   ```properties
   spring.jpa.hibernate.ddl-auto=update
   ```
3. **Start the application** - Hibernate will auto-create the new table and column
4. **Verify changes**:
   ```sql
   -- Check user_settings table
   \d user_settings
   
   -- Check requests table for category column
   \d requests
   ```

### For Production (Neon Database):

1. **Connect to Neon database**:
   ```bash
   psql "postgresql://username:password@host/database?sslmode=require"
   ```

2. **Run migration scripts**:
   ```sql
   -- Create user_settings table
   CREATE TABLE IF NOT EXISTS user_settings (
       settings_id BIGSERIAL PRIMARY KEY,
       user_id BIGINT NOT NULL UNIQUE,
       email_notifications BOOLEAN NOT NULL DEFAULT true,
       push_notifications BOOLEAN NOT NULL DEFAULT true,
       request_updates BOOLEAN NOT NULL DEFAULT true,
       assignment_updates BOOLEAN NOT NULL DEFAULT true,
       FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
   );
   
   -- Add category column to requests
   ALTER TABLE requests ADD COLUMN IF NOT EXISTS category VARCHAR(50) NOT NULL DEFAULT 'GENERAL_HELP';
   
   -- Update existing requests with default category
   UPDATE requests SET category = 'GENERAL_HELP' WHERE category IS NULL;
   ```

3. **Verify production changes**:
   ```sql
   SELECT COUNT(*) FROM user_settings;
   SELECT DISTINCT category FROM requests;
   ```

## 🔄 Automatic Migration (Recommended)

### Update DataInitializer for Safe Migration:
The DataInitializer will handle the migration automatically when the application starts.

### Configuration for Both Environments:

**Local (application-dev.properties):**
```properties
spring.jpa.hibernate.ddl-auto=update
```

**Production (application-prod.properties):**
```properties
spring.jpa.hibernate.ddl-auto=validate
```

## ✅ Verification Steps

### 1. Check Tables Exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_settings', 'requests');
```

### 2. Check Columns:
```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_settings';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'requests' AND column_name = 'category';
```

### 3. Test API Endpoints:
- `GET /api/settings/{userId}` - Should return user settings
- `GET /api/categories` - Should return 8 categories
- `POST /api/requests` - Should accept category field

## 🚨 Rollback Plan (If Needed)

### Remove Changes:
```sql
-- Drop user_settings table
DROP TABLE IF EXISTS user_settings CASCADE;

-- Remove category column from requests
ALTER TABLE requests DROP COLUMN IF EXISTS category;
```

## 📊 Expected Database Schema After Migration

### Tables Count: **9 tables**
1. `locations` (30 districts)
2. `users` (citizens & volunteers)
3. `requests` (with category field)
4. `assignments` (volunteer tasks)
5. `notifications` (user alerts)
6. `skills` (volunteer capabilities)
7. `user_skills` (junction table)
8. `user_settings` (notification preferences) **NEW**

### New Relationships:
- `users` ↔ `user_settings` (One-to-One)
- `requests.category` (Enum field with 8 values)

## 🔧 Environment Variables

Ensure these are set for production:
```bash
PROD_DB_URL=your_neon_database_url
PROD_DB_USERNAME=your_username
PROD_DB_PASSWORD=your_password
SPRING_PROFILES_ACTIVE=prod
```

## 📝 Post-Migration Checklist

- [ ] Local database updated successfully
- [ ] Production database updated successfully
- [ ] All 9 tables exist
- [ ] UserSettings API endpoints working
- [ ] Categories API endpoint working
- [ ] Request creation with category working
- [ ] No data loss occurred
- [ ] Application starts without errors
- [ ] All existing functionality still works

## 🆘 Troubleshooting

### Common Issues:

1. **Foreign key constraint error**:
   - Ensure users table exists before creating user_settings
   - Check user_id references are valid

2. **Column already exists error**:
   - Use `ADD COLUMN IF NOT EXISTS` syntax
   - Check if migration was already applied

3. **Permission denied**:
   - Ensure database user has CREATE/ALTER permissions
   - For Neon, use the connection string with proper credentials

### Support:
If issues occur, check application logs and database connection status.