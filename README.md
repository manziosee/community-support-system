# Community Help Portal

**A full-stack web application connecting citizens with volunteers for community assistance.**

## Live Deployment

- **Backend API**: [community-support-system.fly.dev](https://community-support-system.fly.dev)
- **Frontend App**: [community-support-system.vercel.app](https://community-support-system.vercel.app)
- **API Docs**: [Swagger UI](https://community-support-system.fly.dev/swagger-ui.html)

## Technology Stack

**Backend**
- Spring Boot 3.5.6, Java 17
- PostgreSQL 17+
- JWT Authentication (Spring Security)
- SendGrid (email verification)
- Swagger / OpenAPI 3.0

**Frontend**
- React 19 + TypeScript + Vite
- Tailwind CSS (black & white / grayscale design system)
- Recharts, React Query, React i18next (EN / FR)
- Lucide icons

**Deployment**
- Backend: Fly.io
- Frontend: Vercel

## Database Schema

**9 Tables**: 7 core entities + 2 junction tables

| Table | Description |
|-------|-------------|
| Locations | Rwandan administrative hierarchy (30 districts) |
| Users | Citizens, Volunteers, Admins with role-based access |
| Requests | Help requests with status tracking |
| Assignments | Volunteer task assignments |
| Notifications | User alerts system |
| Skills | Volunteer capabilities (46 skills) |
| User_Skills | Many-to-many junction |
| User_Settings | Notification preferences |
| Achievements | Gamification badges and rewards |

## API Endpoints (160+ Total)

| Group | Endpoints | Notes |
|-------|-----------|-------|
| Locations | 11 | Province/district filtering, Rwanda API integration |
| Users | 25 | Role-based access, location hierarchy, skills |
| Requests | 16 | Status tracking, citizen stats endpoint |
| Assignments | 11 | Volunteer task management |
| Notifications | 15 | Real-time alerts, read/unread status, stats |
| Skills | 13 | Volunteer capabilities |
| Rwanda API | 5 | Live location data (Province to Village) |
| Settings | 4 | User preferences |
| Analytics | 7 | Dashboard stats, province breakdown, growth metrics |
| Admin | 10 | User moderation, request moderation, broadcast |
| Gamification | 3 | Points, levels, leaderboard |
| Availability | 3 | Volunteer scheduling and status |
| Ratings | 4 | Volunteer reviews and averages |
| Appointments | 4 | Citizen-volunteer scheduling |
| Expenses | 5 | Expense tracking and approvals |
| Categories | 1 | Request categories |

## Quick Setup

### Prerequisites

- Java 17
- Maven 3.8+
- PostgreSQL 14+
- Node.js 20+ (for frontend)

### Backend

```bash
git clone https://github.com/manziosee/community-support-system.git
cd community-support-system

# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE community_support_system_db;"

# Run with dev profile
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### Production Deployment

```bash
# Deploy backend to Fly.io
flyctl deploy
```

## Environment Configuration

**Local (dev profile)**
- Database: `jdbc:postgresql://localhost:5432/community_support_system_db`
- Server: `http://localhost:8080`

**Production (fly profile)**
- Database: Fly.io PostgreSQL (auto-configured)
- Server: `https://community-support-system.fly.dev`
- Email: SendGrid enabled

## Features

- Complete CRUD Operations for all entities
- Rwanda Location Integration - 5-level hierarchy (Province to Village)
- Email Verification via SendGrid
- JWT Authentication with role-based access (Citizens, Volunteers, Admins)
- Real-time Notifications for assignment updates
- Analytics Dashboard with real DB-backed statistics
- Gamification system - points, levels, achievements, leaderboard
- Volunteer availability scheduling
- Expense tracking and admin approvals
- Internationalisation - English and French
- API Documentation via Swagger UI
- Health Monitoring via Spring Actuator
- Postman collection with 160+ documented endpoints

## Admin Access

Default admin account (dev only):
- Email: `darkosee23@gmail.com`
- Password: `admin123`
- Role: `ADMIN`

## API Testing

```bash
# Health check
curl http://localhost:8080/health

# Get all locations
curl http://localhost:8080/api/locations

# Get all skills
curl http://localhost:8080/api/skills

# Get volunteers
curl http://localhost:8080/api/users/role/VOLUNTEER

# Analytics dashboard
curl http://localhost:8080/api/analytics/dashboard

# Gamification leaderboard
curl http://localhost:8080/api/gamification/leaderboard

# Volunteer availability
curl http://localhost:8080/api/availability/volunteer/1
```

Import `Community_Support_System.postman_collection.json` into Postman for the full collection.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request against `main`