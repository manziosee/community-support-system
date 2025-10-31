# 🤝 Volunteer-Focused API Examples

## 🚀 Complete Volunteer Workflow Examples

### 1. Create a Volunteer (No Password Required)

```bash
POST /api/users
Content-Type: application/json

{
  "name": "Jean Baptiste Uwimana",
  "email": "jean.volunteer@gmail.com",
  "phoneNumber": "0788123456",
  "role": "VOLUNTEER",
  "location": {
    "locationId": 1
  },
  "sector": "Kimisagara",
  "cell": "Nyabugogo",
  "village": "Kacyiru",
  "skills": [
    {"skillId": 1},
    {"skillId": 2}
  ]
}
```

**Expected Response:**
```json
{
  "userId": 1,
  "name": "Jean Baptiste Uwimana",
  "email": "jean.volunteer@gmail.com",
  "phoneNumber": "0788123456",
  "role": "VOLUNTEER",
  "createdAt": "2025-10-31T10:30:00",
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
    },
    {
      "skillId": 2,
      "skillName": "Tutoring",
      "description": "Academic tutoring and teaching"
    }
  ]
}
```

### 2. Create a Citizen (Who Needs Help)

```bash
POST /api/users
Content-Type: application/json

{
  "name": "Uwimana Grace",
  "email": "grace.citizen@gmail.com",
  "phoneNumber": "0787654321",
  "role": "CITIZEN",
  "location": {
    "locationId": 1
  },
  "sector": "Kimisagara",
  "cell": "Nyabugogo",
  "village": "Kacyiru"
}
```

### 3. Citizen Creates a Request for Help

```bash
POST /api/requests
Content-Type: application/json

{
  "title": "Need help with grocery shopping",
  "description": "I need assistance with grocery shopping for elderly parent. Looking for someone who can help with weekly shopping in Kimisagara area.",
  "citizen": {
    "userId": 2
  }
}
```

**Expected Response:**
```json
{
  "requestId": 1,
  "title": "Need help with grocery shopping",
  "description": "I need assistance with grocery shopping for elderly parent. Looking for someone who can help with weekly shopping in Kimisagara area.",
  "status": "PENDING",
  "createdAt": "2025-10-31T10:35:00",
  "citizen": {
    "userId": 2,
    "name": "Uwimana Grace",
    "email": "grace.citizen@gmail.com",
    "role": "CITIZEN"
  }
}
```

### 4. Volunteer Accepts the Request (Creates Assignment)

```bash
POST /api/assignments
Content-Type: application/json

{
  "request": {
    "requestId": 1
  },
  "volunteer": {
    "userId": 1
  }
}
```

**Expected Response:**
```json
{
  "assignmentId": 1,
  "acceptedAt": "2025-10-31T10:40:00",
  "completedAt": null,
  "request": {
    "requestId": 1,
    "title": "Need help with grocery shopping",
    "status": "ACCEPTED"
  },
  "volunteer": {
    "userId": 1,
    "name": "Jean Baptiste Uwimana",
    "email": "jean.volunteer@gmail.com",
    "role": "VOLUNTEER"
  }
}
```

### 5. Volunteer Completes the Assignment

```bash
PATCH /api/assignments/1/complete
```

**Expected Response:**
```json
{
  "assignmentId": 1,
  "acceptedAt": "2025-10-31T10:40:00",
  "completedAt": "2025-10-31T11:30:00",
  "request": {
    "requestId": 1,
    "title": "Need help with grocery shopping",
    "status": "COMPLETED"
  },
  "volunteer": {
    "userId": 1,
    "name": "Jean Baptiste Uwimana"
  }
}
```

### 6. Send Notification to Volunteer

```bash
POST /api/notifications
Content-Type: application/json

{
  "message": "New request available in your area: Grocery shopping assistance needed in Kimisagara",
  "user": {
    "userId": 1
  }
}
```

---

## 🔍 Volunteer Discovery & Management

### Find Volunteers by Location

```bash
GET /api/users/volunteers/province/Kigali City
```

### Find Volunteers by Skills

```bash
GET /api/users/role/VOLUNTEER
```

### Get Volunteer's Assignments

```bash
GET /api/assignments/volunteer/1
```

### Get Volunteer's Assignment History (Paginated)

```bash
GET /api/assignments/volunteer/1/paginated?page=0&size=10
```

### Get Top Performing Volunteers

```bash
GET /api/assignments/top-volunteers
```

---

## 📊 Volunteer Statistics

### Count Total Volunteers

```bash
GET /api/users/count/volunteers
```

### Count Volunteer's Completed Assignments

```bash
GET /api/assignments/completed
```

### Get Volunteer's Notifications

```bash
GET /api/notifications/user/1
```

### Count Unread Notifications for Volunteer

```bash
GET /api/notifications/user/1/unread/count
```

---

## 🎯 Skills Management for Volunteers

### Get All Available Skills

```bash
GET /api/skills
```

**Response:**
```json
[
  {
    "skillId": 1,
    "skillName": "Programming",
    "description": "Software development and coding"
  },
  {
    "skillId": 2,
    "skillName": "Tutoring",
    "description": "Academic tutoring and teaching"
  },
  {
    "skillId": 3,
    "skillName": "Delivery",
    "description": "Package and grocery delivery services"
  }
]
```

### Create New Skill

```bash
POST /api/skills
Content-Type: application/json

{
  "skillName": "Elderly Care",
  "description": "Assistance and care for elderly people"
}
```

### Search Skills by Name

```bash
GET /api/skills/search/name/Programming
```

---

## 🏠 Location-Based Volunteer Services

### Get All Locations

```bash
GET /api/locations
```

### Find Volunteers in Specific Province

```bash
GET /api/users/volunteers/province/Kigali City
```

### Get Assignments by Province

```bash
GET /api/assignments/province/Kigali City
```

---

## 🔔 Volunteer Notification System

### Mark Notification as Read

```bash
PATCH /api/notifications/1/read
```

### Mark All Notifications as Read for Volunteer

```bash
PATCH /api/notifications/user/1/mark-all-read
```

### Get Recent Notifications

```bash
GET /api/notifications/user/1/unread
```

---

## 📈 Volunteer Performance Tracking

### Get Volunteer's Request History

```bash
GET /api/requests/citizen/2
```

### Get Recent Requests (Last 7 Days)

```bash
GET /api/requests/recent
```

### Search Requests by Title

```bash
GET /api/requests/search/title/grocery
```

### Get Pending Requests in Area

```bash
GET /api/requests/search?status=PENDING&province=Kigali City&page=0&size=10
```

---

## 🚀 Complete Volunteer Onboarding Flow

1. **Create Volunteer Account** → `POST /api/users`
2. **Verify Email Availability** → `GET /api/users/exists/email/{email}`
3. **Get Available Skills** → `GET /api/skills`
4. **Update Volunteer with Skills** → `PUT /api/users/{id}`
5. **Find Nearby Requests** → `GET /api/requests/province/{province}`
6. **Accept Request** → `POST /api/assignments`
7. **Get Assignment Details** → `GET /api/assignments/{id}`
8. **Complete Assignment** → `PATCH /api/assignments/{id}/complete`
9. **Check New Notifications** → `GET /api/notifications/user/{id}/unread`

---

## 🎯 Key Features for Volunteers

✅ **No Password Required** - Simplified registration  
✅ **Skills-Based Matching** - Volunteers can specify their skills  
✅ **Location-Based Services** - Find requests in your area  
✅ **Real-time Notifications** - Get notified of new requests  
✅ **Assignment Tracking** - Track your volunteer history  
✅ **Performance Metrics** - See your impact and statistics  
✅ **Easy Request Management** - Accept, track, and complete requests  

---

## 📱 Mobile-Friendly API Design

All endpoints return clean JSON without null collections, making them perfect for mobile app integration. The volunteer-focused design ensures:

- Fast volunteer registration
- Easy request discovery
- Simple assignment management
- Clear notification system
- Comprehensive tracking and statistics

**Ready to help your community! 🤝**