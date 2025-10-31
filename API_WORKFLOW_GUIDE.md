# Community Support System - Complete API Workflow Guide

## Step-by-Step API Communication Flow

### STEP 1: Create a Volunteer
**API**: `POST /api/users`
```json
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
**Response**: Returns volunteer with `userId: 1`

---

### STEP 2: Create a Citizen (who will make requests)
**API**: `POST /api/users`
```json
{
  "name": "Marie Claire Mukamana",
  "email": "marie.citizen@gmail.com",
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
**Response**: Returns citizen with `userId: 2`

---

### STEP 3: Citizen Creates a Help Request
**API**: `POST /api/requests`
```json
{
  "title": "Need help with grocery shopping",
  "description": "I need assistance with grocery shopping for elderly parent. Looking for someone who can help with weekly shopping in Kimisagara area.",
  "citizen": {
    "userId": 2
  }
}
```
**Response**: Returns request with `requestId: 1` and status `PENDING`

---

### STEP 4: Volunteer Views Available Requests
**API**: `GET /api/requests/status/PENDING`
**Response**: List of all pending requests including the one created in Step 3

---

### STEP 5: Volunteer Accepts the Request (Creates Assignment)
**API**: `POST /api/assignments`
```json
{
  "request": {
    "requestId": 1
  },
  "volunteer": {
    "userId": 1
  }
}
```
**Response**: Returns assignment with `assignmentId: 1` and automatically changes request status to `ACCEPTED`

---

### STEP 6: System Sends Notification to Citizen
**API**: `POST /api/notifications`
```json
{
  "message": "Your request 'Need help with grocery shopping' has been accepted by Jean Baptiste Uwimana",
  "user": {
    "userId": 2
  }
}
```
**Response**: Returns notification with `notificationId: 1`

---

### STEP 7: Citizen Checks Notifications
**API**: `GET /api/notifications/user/2/unread`
**Response**: List of unread notifications for the citizen

---

### STEP 8: Volunteer Views Their Assignments
**API**: `GET /api/assignments/volunteer/1`
**Response**: List of all assignments for the volunteer

---

### STEP 9: Volunteer Completes the Assignment
**API**: `PATCH /api/assignments/1/complete`
**Response**: Updates assignment with completion timestamp and changes request status to `COMPLETED`

---

### STEP 10: System Sends Completion Notification
**API**: `POST /api/notifications`
```json
{
  "message": "Your request 'Need help with grocery shopping' has been completed by Jean Baptiste Uwimana",
  "user": {
    "userId": 2
  }
}
```
**Response**: Returns completion notification

---

### STEP 11: Citizen Marks Notification as Read
**API**: `PATCH /api/notifications/2/read`
**Response**: Marks the notification as read

---

## Complete Test Sequence (Copy-Paste Ready)

### 1. Create Volunteer
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jean Baptiste Uwimana",
    "email": "jean.volunteer@gmail.com",
    "phoneNumber": "0788123456",
    "role": "VOLUNTEER",
    "location": {"locationId": 1},
    "sector": "Kimisagara",
    "cell": "Nyabugogo",
    "village": "Kacyiru",
    "skills": [{"skillId": 1}, {"skillId": 2}]
  }'
```

### 2. Create Citizen
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marie Claire Mukamana",
    "email": "marie.citizen@gmail.com",
    "phoneNumber": "0787654321",
    "role": "CITIZEN",
    "location": {"locationId": 1},
    "sector": "Kimisagara",
    "cell": "Nyabugogo",
    "village": "Kacyiru"
  }'
```

### 3. Create Request
```bash
curl -X POST http://localhost:8080/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Need help with grocery shopping",
    "description": "I need assistance with grocery shopping for elderly parent.",
    "citizen": {"userId": 2}
  }'
```

### 4. View Pending Requests
```bash
curl -X GET http://localhost:8080/api/requests/status/PENDING
```

### 5. Create Assignment
```bash
curl -X POST http://localhost:8080/api/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "request": {"requestId": 1},
    "volunteer": {"userId": 1}
  }'
```

### 6. Send Notification
```bash
curl -X POST http://localhost:8080/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Your request has been accepted by Jean Baptiste Uwimana",
    "user": {"userId": 2}
  }'
```

### 7. Check Notifications
```bash
curl -X GET http://localhost:8080/api/notifications/user/2/unread
```

### 8. View Assignments
```bash
curl -X GET http://localhost:8080/api/assignments/volunteer/1
```

### 9. Complete Assignment
```bash
curl -X PATCH http://localhost:8080/api/assignments/1/complete
```

### 10. Send Completion Notification
```bash
curl -X POST http://localhost:8080/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Your request has been completed by Jean Baptiste Uwimana",
    "user": {"userId": 2}
  }'
```

### 11. Mark Notification as Read
```bash
curl -X PATCH http://localhost:8080/api/notifications/1/read
```

## Status Flow Summary
1. **Request**: PENDING → ACCEPTED → COMPLETED
2. **Assignment**: Created → Completed
3. **Notifications**: Created → Read
4. **Users**: Volunteer & Citizen interact through the system

## Key API Endpoints Used
- `POST /api/users` - Create users
- `POST /api/requests` - Create help requests
- `GET /api/requests/status/PENDING` - View available requests
- `POST /api/assignments` - Accept requests
- `PATCH /api/assignments/{id}/complete` - Complete work
- `POST /api/notifications` - Send notifications
- `GET /api/notifications/user/{id}/unread` - Check notifications
- `PATCH /api/notifications/{id}/read` - Mark as read