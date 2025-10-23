# Community Support System - ERD Relationships

## Table Relationships for ERD Diagram

### 1. **LOCATIONS** (Parent Table)
```
Primary Key: location_id (BIGINT, AUTO_INCREMENT)
Unique Key: province_code
```
**Relationships:**
- **1:N** → USERS (One location has many users)

### 2. **USERS** (Central Entity)
```
Primary Key: user_id (BIGINT, AUTO_INCREMENT)
Foreign Key: location_id → LOCATIONS(location_id)
Unique Key: email
```
**Relationships:**
- **N:1** → LOCATIONS (Many users belong to one location)
- **1:N** → REQUESTS (One citizen has many requests)
- **1:N** → ASSIGNMENTS (One volunteer has many assignments)
- **1:N** → NOTIFICATIONS (One user has many notifications)
- **M:N** → SKILLS (Many users have many skills)

### 3. **SKILLS** (Lookup Table)
```
Primary Key: skill_id (BIGINT, AUTO_INCREMENT)
Unique Key: skill_name
```
**Relationships:**
- **M:N** → USERS (Many skills belong to many users)

### 4. **REQUESTS** (Transaction Entity)
```
Primary Key: request_id (BIGINT, AUTO_INCREMENT)
Foreign Key: citizen_id → USERS(user_id)
```
**Relationships:**
- **N:1** → USERS (Many requests belong to one citizen)
- **1:N** → ASSIGNMENTS (One request can have many assignments)

### 5. **ASSIGNMENTS** (Transaction Entity)
```
Primary Key: assignment_id (BIGINT, AUTO_INCREMENT)
Foreign Key: request_id → REQUESTS(request_id)
Foreign Key: volunteer_id → USERS(user_id)
```
**Relationships:**
- **N:1** → REQUESTS (Many assignments belong to one request)
- **N:1** → USERS (Many assignments belong to one volunteer)

### 6. **NOTIFICATIONS** (Dependent Entity)
```
Primary Key: notification_id (BIGINT, AUTO_INCREMENT)
Foreign Key: user_id → USERS(user_id)
```
**Relationships:**
- **N:1** → USERS (Many notifications belong to one user)

### 7. **USER_SKILLS** (Junction Table)
```
Composite Primary Key: (skill_id, user_id)
Foreign Key: skill_id → SKILLS(skill_id)
Foreign Key: user_id → USERS(user_id)
```
**Relationships:**
- **N:1** → SKILLS (Many user_skills belong to one skill)
- **N:1** → USERS (Many user_skills belong to one user)

## ERD Diagram Structure

```
LOCATIONS (1) ←→ (N) USERS (N) ←→ (M) USER_SKILLS (M) ←→ (1) SKILLS
    ↑                   ↓
    |                   | (1)
    |                   ↓
    |               REQUESTS (1)
    |                   ↓
    |               ASSIGNMENTS (N)
    |                   ↑
    |                   | (N:1)
    |                   ↓
    └─────────── NOTIFICATIONS (N)
```

## Cardinality Summary

| Relationship | Type | Description |
|-------------|------|-------------|
| LOCATIONS → USERS | 1:N | One location has many users |
| USERS → REQUESTS | 1:N | One citizen creates many requests |
| USERS → ASSIGNMENTS | 1:N | One volunteer accepts many assignments |
| USERS → NOTIFICATIONS | 1:N | One user receives many notifications |
| REQUESTS → ASSIGNMENTS | 1:N | One request can have multiple assignments |
| USERS ↔ SKILLS | M:N | Many users have many skills (via USER_SKILLS) |

## Key Constraints

- **Primary Keys:** All tables have auto-incrementing BIGINT primary keys
- **Foreign Keys:** All relationships enforced with foreign key constraints
- **Unique Constraints:** email (users), skill_name (skills), province_code (locations)
- **Check Constraints:** role enum, status enum
- **Composite Key:** USER_SKILLS table uses (skill_id, user_id)

This schema supports the complete Community Help Portal functionality with proper referential integrity.