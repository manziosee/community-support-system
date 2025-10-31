# 🗑️ Database Reset Guide

## 🔄 Complete Database Reset Process

### Current Configuration:
- **DDL Mode**: `create` (drops and recreates all tables on startup)
- **Data Initializer**: Clears all existing data and loads fresh sample data
- **Auto-Reset**: Every application restart = fresh database

---

## 🚀 How to Reset Database

### Method 1: Restart Application (Recommended)
```bash
# Stop the application (Ctrl+C if running)
# Then restart:
mvn spring-boot:run
```

**What happens:**
1. 🗑️ **Drops all tables** (users, requests, assignments, notifications, locations, skills, user_skills)
2. 🏗️ **Recreates schema** with updated User model (including phoneNumber field)
3. 🌱 **Loads fresh data**:
   - 30 Rwandan locations (5 provinces, 30 districts)
   - 10 skills for volunteers
   - No users, requests, assignments, or notifications

### Method 2: Manual Database Reset (Alternative)
```sql
-- Connect to PostgreSQL
psql -U postgres -d community_support_system_db

-- Drop all tables
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS locations CASCADE;

-- Exit and restart application
\q
```

---

## 📊 Fresh Database State

### After Reset, You'll Have:

#### ✅ **Locations Table (30 records)**
```
locationId | province          | district    | provinceCode
1          | Kigali City       | Gasabo      | KG01
2          | Kigali City       | Kicukiro    | KG02
3          | Kigali City       | Nyarugenge  | KG03
...        | ...               | ...         | ...
30         | Northern Province | Musanze     | NP05
```

#### ✅ **Skills Table (10 records)**
```
skillId | skillName      | description
1       | Programming    | Software development and coding
2       | Tutoring       | Academic tutoring and teaching
3       | Delivery       | Package and grocery delivery services
...     | ...            | ...
10      | Education      | Teaching and educational support
```

#### ✅ **Empty Tables**
- `users` - 0 records
- `requests` - 0 records  
- `assignments` - 0 records
- `notifications` - 0 records
- `user_skills` - 0 records

---

## 🧪 Test Fresh Database

### 1. Verify Clean State
```bash
# Check locations loaded
GET /api/locations
# Expected: 30 locations

# Check skills loaded  
GET /api/skills
# Expected: 10 skills

# Check no users
GET /api/users
# Expected: []

# Check no requests
GET /api/requests  
# Expected: []
```

### 2. Create First Volunteer (No Password Required)
```json
POST /api/users
{
  "name": "Jean Baptiste Uwimana",
  "email": "jean.volunteer@gmail.com",
  "phoneNumber": "0788123456",
  "role": "VOLUNTEER",
  "location": {"locationId": 1},
  "sector": "Kimisagara",
  "cell": "Nyabugogo", 
  "village": "Kacyiru",
  "skills": [
    {"skillId": 1},
    {"skillId": 2}
  ]
}
```

### 3. Expected Clean Response (No Password Field)
```json
{
  "userId": 1,
  "name": "Jean Baptiste Uwimana",
  "email": "jean.volunteer@gmail.com",
  "phoneNumber": "0788123456",
  "role": "VOLUNTEER",
  "createdAt": "2025-10-31T...",
  "location": {
    "locationId": 1,
    "province": "Kigali City",
    "district": "Gasabo",
    "provinceCode": "KG01"
  },
  "sector": "Kimisagara",
  "cell": "Nyabugogo",
  "village": "Kacyiru",
  "skills": [
    {
      "skillId": 1,
      "skillName": "Programming",
      "description": "Software development and coding"
    }
  ]
}
```

**Note**: No null collections (`requests`, `assignments`, etc.) in response!

---

## 🔧 Updated Schema Features

### Updated User Table Structure (No Password):
```sql
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(10) NOT NULL UNIQUE,
    role VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    location_id BIGINT REFERENCES locations(location_id),
    sector VARCHAR(255),     -- User input
    cell VARCHAR(255),       -- User input  
    village VARCHAR(255)     -- User input
);
```

### Key Improvements:
- ✅ **No Password Required**: Simplified volunteer registration
- ✅ **Phone Number**: 10-digit unique field
- ✅ **Email Uniqueness**: Enforced at DB level
- ✅ **User Location Fields**: sector/cell/village for manual entry
- ✅ **Skills Integration**: Volunteers can have multiple skills
- ✅ **Clean JSON**: No null collections in responses
- ✅ **Proper Validation**: Phone format, email format, uniqueness checks

---

## 🎯 Testing Checklist After Reset

- [ ] **Locations**: 30 records loaded
- [ ] **Skills**: 10 records loaded  
- [ ] **Users**: 0 records (empty)
- [ ] **Create Volunteer**: No password required, works with skills
- [ ] **Validation**: Duplicate email fails
- [ ] **Validation**: Duplicate phone fails
- [ ] **Validation**: Invalid phone format fails
- [ ] **Response**: No password field, no null collections
- [ ] **Skills**: Volunteer skills properly associated
- [ ] **Location**: User sector/cell/village preserved

---

## 🚨 Important Notes

1. **Every Restart = Fresh DB**: Current config drops all data on restart
2. **No Password Required**: Simplified volunteer registration process
3. **Phone Number Required**: All new users must have 10-digit phone number
4. **Unique Constraints**: Email and phone must be unique
5. **Skills Integration**: Volunteers can specify their skills during registration
6. **Clean Responses**: No password field, no null collection fields
7. **85+ Total Endpoints**: Volunteer-focused API design

**Ready to start fresh! Restart your application now.** 🚀