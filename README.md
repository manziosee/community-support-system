# 🤝 Community Help Portal

**A Spring Boot web application connecting citizens with volunteers for community assistance.**

## 🚀 Live Deployment

- **Backend API**: [community-support-system.fly.dev](https://community-support-system.fly.dev)
- **Frontend App**: [community-support-system.vercel.app](https://community-support-system.vercel.app)
- **API Docs**: [Swagger UI](https://community-support-system.fly.dev/swagger-ui.html)

## 🛠️ Technology Stack

- **Backend**: Spring Boot 3.5.6, Java 21
- **Database**: PostgreSQL 17+
- **Deployment**: Fly.io (Backend), Vercel (Frontend)
- **Email**: SendGrid integration
- **Location API**: Rwanda Administrative Divisions

## 📊 Database Schema

**9 Tables**: 7 core entities + 2 junction tables
- 🏛️ **Locations** (30 districts) - Rwandan administrative hierarchy
- 👥 **Users** - Citizens & Volunteers with role-based access
- 📝 **Requests** - Help requests with status tracking
- 🤝 **Assignments** - Volunteer task assignments
- 🔔 **Notifications** - User alerts system
- 🎯 **Skills** - Volunteer capabilities (46 skills)
- 🔗 **User_Skills** - Many-to-many junction
- ⚙️ **User_Settings** - Notification preferences

## 🌐 API Endpoints (135+ Total)

| Entity | Endpoints | Key Features |
|--------|-----------|-------------|
| 🏛️ Locations | 11 | Province/district filtering, Rwanda API integration |
| 👥 Users | 25 | Role-based access, location hierarchy, skills |
| 📝 Requests | 15 | Status tracking, citizen requests |
| 🤝 Assignments | 11 | Volunteer task management |
| 🔔 Notifications | 14 | Real-time alerts, read/unread status |
| 🎯 Skills | 13 | Volunteer capabilities |
| 🇷🇼 Rwanda API | 5 | Live location data (Province→Village) |
| ⚙️ Settings | 4 | User preferences |
| 📊 Analytics | 4 | Dashboard statistics, charts data |

## 🔧 Quick Setup

### Local Development
```bash
git clone https://github.com/manziosee/community-support-system.git
cd community-support-system

# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE community_support_system_db;"

# Run with dev profile
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run
```

### Production Deployment
```bash
# Deploy to Fly.io
flyctl deploy
```

## 🌍 Environment Configuration

**Local (dev profile)**:
- Database: `jdbc:postgresql://localhost:5432/community_support_system_db`
- Server: `http://localhost:8080`

**Production (fly profile)**:
- Database: Fly.io PostgreSQL (auto-configured)
- Server: `https://community-support-system.fly.dev`
- Email: SendGrid enabled

## 📋 Features

✅ **Complete CRUD Operations** for all entities  
✅ **Rwanda Location Integration** - 5-level hierarchy (Province→Village)  
✅ **Email Verification** - SendGrid integration  
✅ **Role-based Access** - Citizens, Volunteers, Admins  
✅ **Real-time Notifications** - Assignment updates  
✅ **Advanced Queries** - Pagination, filtering, search  
✅ **Analytics Dashboard** - Interactive charts with Recharts  
✅ **API Documentation** - Swagger UI  
✅ **Health Monitoring** - Actuator endpoints  
✅ **Production Ready** - Cloud deployed  

## 🔐 Admin Access

**Default Admin Account**:
- Email: `oseemanzi3@gmail.com`
- Password: `admin123`
- Role: `ADMIN`

## 📚 API Testing

```bash
# Health check
curl https://community-support-system.fly.dev/health

# Get all locations
curl https://community-support-system.fly.dev/api/locations

# Get all skills
curl https://community-support-system.fly.dev/api/skills

# Get volunteers
curl https://community-support-system.fly.dev/api/users/role/VOLUNTEER

# Get volunteer analytics
curl https://community-support-system.fly.dev/api/analytics/volunteer/1

# Get citizen analytics
curl https://community-support-system.fly.dev/api/analytics/citizen/2
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**🚀 Ready for production use with full cloud deployment!**