# Docker Deployment Guide

## 🐳 Docker Configurations Created

### 1. Backend Only
```bash
# Build and run backend with PostgreSQL
docker build -t community-backend .
docker run -p 8080:8080 community-backend
```

### 2. Complete System (Recommended)
```bash
# Run complete system with database, backend, and frontend
docker-compose up -d
```

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB disk space

## 🚀 Quick Start

### Option 1: Complete System
```bash
cd /home/manzi/WEBTECH/community-support-system
docker-compose up -d
```

**Access Points:**
- Frontend: http://localhost
- Backend API: http://localhost:8080/api
- Database: localhost:5432

### Option 2: Backend Only
```bash
cd /home/manzi/WEBTECH/community-support-system
docker build -t community-backend .
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=docker community-backend
```

## 🔧 Configuration

### Environment Variables
- `POSTGRES_DB`: community_support_system_db
- `POSTGRES_USER`: postgres  
- `POSTGRES_PASSWORD`: postgres
- `SPRING_PROFILES_ACTIVE`: docker

### Ports
- Frontend: 80
- Backend: 8080
- Database: 5432

## 📊 Services

| Service | Container | Health Check | Dependencies |
|---------|-----------|--------------|--------------|
| Database | community-db | PostgreSQL ready | None |
| Backend | community-backend | API endpoint | Database |
| Frontend | community-frontend | Nginx serving | Backend |

## 🛠️ Management Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up -d --build

# Scale services
docker-compose up -d --scale backend=2

# Remove all data
docker-compose down -v
```

## 🔍 Troubleshooting

### Database Connection Issues
```bash
# Check database health
docker-compose ps
docker-compose logs database

# Reset database
docker-compose down -v
docker-compose up -d
```

### Backend Issues
```bash
# Check backend logs
docker-compose logs backend

# Restart backend only
docker-compose restart backend
```

### Frontend Issues
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

## 📈 Production Considerations

### Security
- Change default passwords
- Use environment files for secrets
- Enable HTTPS with reverse proxy
- Implement proper firewall rules

### Performance
- Use production database settings
- Enable connection pooling
- Configure proper resource limits
- Set up monitoring and logging

### Scaling
```yaml
# docker-compose.override.yml
services:
  backend:
    deploy:
      replicas: 3
  frontend:
    deploy:
      replicas: 2
```

## 🎯 Test Users

After deployment, use these test accounts:

| Role | Email | Password | Features |
|------|-------|----------|----------|
| Admin | admin@community.rw | admin123 | 2FA Demo, Full Access |
| Volunteer | volunteer@community.rw | volunteer123 | Assignment Management |
| Citizen | citizen@community.rw | citizen123 | Request Creation |

## ✅ Verification

1. **Database**: Check PostgreSQL connection
2. **Backend**: Visit http://localhost:8080/api/locations
3. **Frontend**: Visit http://localhost
4. **Integration**: Login with test users
5. **2FA**: Test with admin account

## 🔄 Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and deploy
docker-compose up -d --build

# Check deployment
docker-compose ps
```