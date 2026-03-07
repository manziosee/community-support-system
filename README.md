# Community Help Portal

> A full-stack web application connecting citizens with volunteers for community assistance in Rwanda.

[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203.5-6db33f?style=flat-square&logo=springboot&logoColor=white)](https://community-support-system.fly.dev)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019-61dafb?style=flat-square&logo=react&logoColor=black)](https://community-support-system.vercel.app)
[![Java](https://img.shields.io/badge/Java-17-ed8b00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/17/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-black?style=flat-square)](LICENSE)

---

## Live Deployment

| Service | URL |
|---------|-----|
| Frontend App | [community-support-system.vercel.app](https://community-support-system.vercel.app) |
| Backend API | [community-support-system.fly.dev](https://community-support-system.fly.dev) |
| Swagger UI | [/swagger-ui.html](https://community-support-system.fly.dev/swagger-ui.html) |
| Health Check | [/actuator/health](https://community-support-system.fly.dev/actuator/health) |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│                                                                     │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │              React 19 + TypeScript + Vite                    │  │
│   │                  (Vercel — CDN Edge)                         │  │
│   │                                                              │  │
│   │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│   │   │ Citizen  │  │Volunteer │  │  Admin   │  │ Landing  │   │  │
│   │   │Dashboard │  │Dashboard │  │Dashboard │  │   Page   │   │  │
│   │   └──────────┘  └──────────┘  └──────────┘  └──────────┘   │  │
│   │                                                              │  │
│   │   Tailwind CSS (B&W)  │  Recharts  │  React Query           │  │
│   │   Lucide Icons        │  i18next   │  Axios                 │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                              │  HTTPS                               │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                         API GATEWAY LAYER                           │
│                                                                     │
│              Spring Security  +  JWT Filter                         │
│                   CORS Policy  +  Rate Limiting                     │
│                                                                     │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                      APPLICATION LAYER                              │
│                  Spring Boot 3.5.6  —  Java 17                      │
│                      (Fly.io — Frankfurt)                           │
│                                                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐   │
│  │    Auth    │ │  Requests  │ │Assignments │ │  Notifications │   │
│  │ Controller │ │ Controller │ │ Controller │ │   Controller   │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────────┘   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐   │
│  │  Analytics │ │Gamification│ │Availability│ │     Admin      │   │
│  │ Controller │ │ Controller │ │ Controller │ │   Controller   │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────────┘   │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      SERVICE LAYER                            │  │
│  │  UserService │ RequestService │ AssignmentService             │  │
│  │  NotificationService │ AnalyticsService │ LeaderboardService  │  │
│  │  AchievementService  │ EmailService     │ AuthService         │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└────────────────────┬──────────────────────────┬─────────────────────┘
                     │                          │
         ┌───────────┘                          └──────────────┐
         ▼                                                     ▼
┌─────────────────────────┐              ┌──────────────────────────┐
│      DATA LAYER          │              │    EXTERNAL SERVICES     │
│                          │              │                          │
│  PostgreSQL 17           │              │  SendGrid  (Email)       │
│  (Fly.io Managed DB)     │              │  Rwanda Location API     │
│                          │              │  (Administrative data)   │
│  9 Tables:               │              │                          │
│  • users                 │              └──────────────────────────┘
│  • locations             │
│  • requests              │
│  • assignments           │
│  • notifications         │
│  • skills                │
│  • user_skills (M:N)     │
│  • user_settings         │
│  • achievements          │
└──────────────────────────┘
```

### User Roles & Flow

```
  CITIZEN                    VOLUNTEER                    ADMIN
     │                           │                          │
     │ Register / Login          │ Register / Login         │ Login
     │                           │                          │
     ├─ Create Request           ├─ Browse Requests         ├─ Manage Users
     ├─ Track Status             ├─ Accept Assignment       ├─ Moderate Requests
     ├─ View Notifications       ├─ Complete Task           ├─ Broadcast Alerts
     ├─ Rate Volunteer           ├─ Earn Points/Badges      ├─ View Analytics
     └─ Book Appointment         └─ View Leaderboard        └─ System Settings
```

---

## Technology Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| ![Java](https://img.shields.io/badge/-Java-ed8b00?logo=openjdk&logoColor=white&style=flat-square) Java | 17 | Core language |
| ![Spring Boot](https://img.shields.io/badge/-Spring%20Boot-6db33f?logo=springboot&logoColor=white&style=flat-square) Spring Boot | 3.5.6 | Application framework |
| ![Spring Security](https://img.shields.io/badge/-Spring%20Security-6db33f?logo=springsecurity&logoColor=white&style=flat-square) Spring Security | 6.x | Auth, CORS, role guards |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white&style=flat-square) PostgreSQL | 17+ | Primary database |
| ![JWT](https://img.shields.io/badge/-JWT-000000?logo=jsonwebtokens&logoColor=white&style=flat-square) JWT | — | Stateless authentication |
| ![Swagger](https://img.shields.io/badge/-Swagger-85ea2d?logo=swagger&logoColor=black&style=flat-square) Swagger / OpenAPI | 3.0 | API documentation |
| ![SendGrid](https://img.shields.io/badge/-SendGrid-1a82e2?logo=twilio&logoColor=white&style=flat-square) SendGrid | — | Transactional email |
| ![Maven](https://img.shields.io/badge/-Maven-c71a36?logo=apachemaven&logoColor=white&style=flat-square) Maven | 3.9+ | Build tool |
| ![Docker](https://img.shields.io/badge/-Docker-2496ed?logo=docker&logoColor=white&style=flat-square) Docker | — | Containerisation |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| ![React](https://img.shields.io/badge/-React-61dafb?logo=react&logoColor=black&style=flat-square) React | 19 | UI library |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript&logoColor=white&style=flat-square) TypeScript | 5.x | Type safety |
| ![Vite](https://img.shields.io/badge/-Vite-646cff?logo=vite&logoColor=white&style=flat-square) Vite | 6.x | Build tool |
| ![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06b6d4?logo=tailwindcss&logoColor=white&style=flat-square) Tailwind CSS | 3.x | Utility-first styling |
| ![Axios](https://img.shields.io/badge/-Axios-5a29e4?logo=axios&logoColor=white&style=flat-square) Axios | — | HTTP client |
| ![React Query](https://img.shields.io/badge/-React%20Query-ff4154?logo=reactquery&logoColor=white&style=flat-square) React Query | 5.x | Server state management |
| ![Recharts](https://img.shields.io/badge/-Recharts-22b5bf?logo=chart.js&logoColor=white&style=flat-square) Recharts | — | Analytics charts |
| ![i18next](https://img.shields.io/badge/-i18next-26a69a?logo=i18next&logoColor=white&style=flat-square) i18next | — | Internationalisation |
| ![Lucide](https://img.shields.io/badge/-Lucide%20Icons-f56565?logo=lucide&logoColor=white&style=flat-square) Lucide | — | Icon set |

### Infrastructure
| Service | Provider | Purpose |
|---------|----------|---------|
| ![Fly.io](https://img.shields.io/badge/-Fly.io-7c3aed?logo=flydotio&logoColor=white&style=flat-square) Backend Hosting | Fly.io | Frankfurt region |
| ![Vercel](https://img.shields.io/badge/-Vercel-000000?logo=vercel&logoColor=white&style=flat-square) Frontend Hosting | Vercel | CDN edge deployment |
| ![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github&logoColor=white&style=flat-square) Source Control | GitHub | CI/CD via Vercel + Fly |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white&style=flat-square) Database | Fly.io Managed | Persistent cloud DB |

---

## Internationalisation (i18n)

The entire UI is available in two languages, switchable at runtime without page reload:

| Language | Code | Flag | Coverage |
|----------|------|------|----------|
| English | `en` | 🇬🇧 | 100% — all pages, labels, errors, toasts |
| French | `fr` | 🇫🇷 | 100% — all pages, labels, errors, toasts |

**Implementation:**
- `react-i18next` with JSON locale files (`frontend/src/i18n/locales/en.json`, `fr.json`)
- `LanguageContext` syncs both i18n systems on language switch
- Language preference persisted in `localStorage`

---

## Design System

The UI uses a **strict black & white / grayscale palette** — no colour anywhere in the interface.

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#000000` | Buttons, headings, active states |
| Secondary | `#333333` | Sub-headings, icons |
| Muted | `#777777` | Placeholder text, borders |
| Surface | `#f5f5f5` | Card backgrounds (light mode) |
| Surface Dark | `#1e1e1e` | Card backgrounds (dark mode) |
| Background | `#ffffff` / `#111111` | Page background |

- Dark mode via Tailwind `dark:` classes, toggled with `class` strategy
- Charts use grayscale hex: `#000000`, `#333333`, `#555555`, `#777777`, `#aaaaaa`, `#bbbbbb`
- No teal, blue, orange, green, or yellow used anywhere

---

## Database Schema

**9 Tables** — 7 core entities + 2 junction tables

```
users ──────────────────────────────────────────────────────────────┐
  │ userId, name, email, role, province, emailVerified, twoFactor   │
  │                                                                  │
  ├──< requests >──────────────────────────────────────────────────  │
  │     requestId, title, description, category, status, citizenId  │
  │                                                                  │
  ├──< assignments >───────────────────────────────────────────────  │
  │     assignmentId, requestId, volunteerId, acceptedAt, completedAt│
  │                                                                  │
  ├──< notifications >─────────────────────────────────────────────  │
  │     notificationId, message, isRead, userId                     │
  │                                                                  │
  ├──< user_skills (M:N) >──────────────── skills ─────────────────  │
  │     userId, skillId                    skillId, skillName        │
  │                                                                  │
  ├──< user_settings >─────────────────────────────────────────────  │
  │     userId, emailNotifications, smsNotifications                 │
  │                                                                  │
  └──< achievements >──────────────────────────────────────────────  │
        achievementId, name, description, userId               ──────┘

locations
  locationId, province, district, provinceCode
  (30 districts across 5 provinces)
```

---

## API Endpoints (160+ Total)

| Group | Count | Key Endpoints |
|-------|-------|---------------|
| Auth | 12 | login, register, verify-email, forgot-password, 2FA |
| Users | 25 | CRUD, role filter, skills, location hierarchy |
| Requests | 16 | create, status update, citizen stats |
| Assignments | 11 | accept, complete, volunteer dashboard |
| Notifications | 15 | list, mark-read, stats, broadcast |
| Skills | 13 | CRUD, popular skills |
| Locations | 11 | provinces, districts, Rwanda hierarchy |
| Rwanda API | 5 | Province → District → Sector → Cell → Village |
| Analytics | 7 | dashboard stats, province breakdown, growth |
| Admin | 10 | moderate requests, lock users, broadcast |
| Gamification | 3 | profile, leaderboard, add points |
| Availability | 3 | get, save, update status |
| Ratings | 4 | create, by volunteer, by assignment, average |
| Appointments | 4 | create, list, update, cancel |
| Expenses | 5 | submit, list, approve, reject |
| Settings | 4 | user preferences |
| Categories | 1 | list all categories |

Full documentation: [Swagger UI](https://community-support-system.fly.dev/swagger-ui.html)
Postman collection: `Community_Support_System.postman_collection.json`

---

## Quick Setup

### Prerequisites

| Tool | Version |
|------|---------|
| Java (JDK) | 17 |
| Maven | 3.8+ |
| PostgreSQL | 14+ |
| Node.js | 20+ |
| npm | 9+ |

### 1 — Backend (Spring Boot)

```bash
git clone https://github.com/manziosee/community-support-system.git
cd community-support-system

# Create database
psql -U postgres -c "CREATE DATABASE community_support_system_db;"

# Run dev profile (test controllers active, H2/Postgres, debug logs)
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run
```

Backend: `http://localhost:8080`
Swagger: `http://localhost:8080/swagger-ui.html`

### 2 — Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`

### 3 — Full Stack with Docker Compose

```bash
# Copy and edit environment variables
cp .env.example .env

docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

### 4 — Production Deploy (Fly.io)

```bash
flyctl deploy
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL JDBC URL |
| `JWT_SECRET` | Yes | Secret key for JWT signing |
| `SENDGRID_API_KEY` | Email | SendGrid API key |
| `SENDGRID_FROM_EMAIL` | Email | Verified sender address |
| `SENDGRID_ENABLED` | No | `true` to enable email (default: `false`) |
| `CORS_ALLOWED_ORIGINS` | Yes | Comma-separated allowed origins |
| `FRONTEND_URL` | Yes | Frontend base URL for email links |
| `SPRING_PROFILES_ACTIVE` | Yes | `dev`, `fly`, or `docker` |

---

## Security

- JWT tokens with configurable expiry (default 24h)
- Email verification required before login
- Optional Two-Factor Authentication (email OTP)
- Account lockout after failed attempts
- Role-based access: `@PreAuthorize("hasRole('ADMIN')")` on all admin endpoints
- CORS restricted to known origins (no wildcard in production)
- Global exception handler — no stack traces leaked to clients
- Test/debug controllers only active under `@Profile("dev")`

---

## Features

| Feature | Details |
|---------|---------|
| CRUD Operations | All 9 entities with full create/read/update/delete |
| Rwanda Locations | 5-level hierarchy: Province → District → Sector → Cell → Village |
| Email Verification | SendGrid — token-based, expires in 24h |
| Two-Factor Auth | Email OTP with backup codes |
| Role-Based Access | Citizen, Volunteer, Admin with method-level enforcement |
| Notifications | Real-time assignment alerts, read/unread tracking |
| Analytics | DB-backed stats, growth metrics, province breakdown |
| Gamification | Points, levels, achievements, leaderboard |
| Availability | Volunteer schedule management |
| Ratings | Post-assignment volunteer reviews with averages |
| Appointments | Citizen-volunteer scheduling |
| Expenses | Claim submission and admin approval flow |
| Internationalisation | English and French, switchable at runtime |
| Dark Mode | System-aware + manual toggle, full Tailwind dark: coverage |
| Postman Collection | 160+ pre-built requests with examples |
| Swagger / OpenAPI | Auto-generated, browsable API docs |

---

## Admin Access

Default account created on first boot (dev / local only):

| Field | Value |
|-------|-------|
| Email | `darkosee23@gmail.com` |
| Password | `admin123` |
| Role | `ADMIN` |

> Change this password immediately in any non-local environment.

---

## API Quick Test

```bash
BASE=http://localhost:8080

# Health
curl $BASE/health

# All locations
curl $BASE/api/locations

# Login
curl -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"darkosee23@gmail.com","password":"admin123"}'

# Analytics dashboard (requires Bearer token)
curl $BASE/api/analytics/dashboard \
  -H "Authorization: Bearer <token>"

# Gamification leaderboard
curl $BASE/api/gamification/leaderboard

# Volunteer availability
curl $BASE/api/availability/volunteer/1
```

---

## Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/my-feature`
3. Commit using conventional commits — `git commit -m 'feat: add my feature'`
4. Push — `git push origin feature/my-feature`
5. Open a Pull Request against `main`

---

*Built for Rwanda community assistance — connecting people who need help with people who can help.*