# 🐳 Docker Deployment Guide

## 📋 Overview

Complete Docker setup for the Community Support System with PostgreSQL, Spring Boot backend, and React frontend.

## 🔧 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB+ RAM available
- Ports 3000, 5432, 8080 available

## 🚀 Quick Start

### **1. Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### **2. Build and Run**
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build
```

### **3. Access Services**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

## 🔧 Environment Variables

### **Required Variables**
```bash
# Database
DB_NAME=community_support_system_db
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password

# Backend
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8080
JWT_SECRET=your-256-bit-secret-key
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Frontend
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🐳 Docker Services

### **Database Service**
```yaml
database:
  image: postgres:17-alpine
  environment:
    POSTGRES_DB: ${DB_NAME:-community_support_system_db}
    POSTGRES_USER: ${DB_USERNAME:-postgres}
    POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
  ports:
    - "5432:5432"
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres"]
```

### **Backend Service**
```yaml
backend:
  build: .
  environment:
    SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE:-dev}
    PORT: ${SERVER_PORT:-8080}
    DB_URL: jdbc:postgresql://database:5432/community_support_system_db
  ports:
    - "8080:8080"
  depends_on:
    database:
      condition: service_healthy
```

### **Frontend Service**
```yaml
frontend:
  build: ./frontend
  ports:
    - "3000:80"
  depends_on:
    backend:
      condition: service_healthy
```

## 🔍 Health Checks

### **Database Health**
```bash
docker-compose exec database pg_isready -U postgres
```

### **Backend Health**
```bash
curl http://localhost:8080/api/locations
```

### **Frontend Health**
```bash
curl http://localhost:3000
```

## 📊 Service Management

### **Start Services**
```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up database
docker-compose up backend
docker-compose up frontend
```

### **Stop Services**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop and remove images
docker-compose down --rmi all
```

### **View Logs**
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs database
docker-compose logs frontend

# Follow logs
docker-compose logs -f backend
```

## 🔧 Development Commands

### **Rebuild Services**
```bash
# Rebuild all
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Force rebuild (no cache)
docker-compose build --no-cache
```

### **Database Operations**
```bash
# Connect to database
docker-compose exec database psql -U postgres -d community_support_system_db

# Backup database
docker-compose exec database pg_dump -U postgres community_support_system_db > backup.sql

# Restore database
docker-compose exec -T database psql -U postgres community_support_system_db < backup.sql
```

### **Backend Operations**
```bash
# Execute backend shell
docker-compose exec backend sh

# View backend logs
docker-compose logs backend

# Restart backend only
docker-compose restart backend
```

## 🐛 Troubleshooting

### **Common Issues**

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :8080
   lsof -i :3000
   lsof -i :5432
   
   # Kill process or change port in .env
   ```

2. **Database Connection Failed**
   ```bash
   # Check database is running
   docker-compose ps database
   
   # Check database logs
   docker-compose logs database
   
   # Restart database
   docker-compose restart database
   ```

3. **Backend Won't Start**
   ```bash
   # Check backend logs
   docker-compose logs backend
   
   # Verify environment variables
   docker-compose exec backend env | grep -E "(DB_|JWT_|SPRING_)"
   
   # Rebuild backend
   docker-compose build --no-cache backend
   ```

4. **Frontend Build Fails**
   ```bash
   # Check frontend logs
   docker-compose logs frontend
   
   # Rebuild frontend
   docker-compose build --no-cache frontend
   
   # Check API connection
   curl http://localhost:8080/api/locations
   ```

### **Performance Issues**

1. **Slow Database**
   ```bash
   # Increase shared_buffers
   # Add to docker-compose.yml database service:
   command: postgres -c shared_buffers=256MB -c max_connections=200
   ```

2. **Backend Memory Issues**
   ```bash
   # Add JVM options to Dockerfile
   ENV JAVA_OPTS="-Xmx1g -Xms512m"
   ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
   ```

## 📈 Production Deployment

### **Production Environment**
```bash
# Set production environment
export SPRING_PROFILES_ACTIVE=prod
export DB_PASSWORD=secure_production_password
export JWT_SECRET=production-256-bit-secret

# Use production compose file
docker-compose -f docker-compose.prod.yml up -d
```

### **Security Considerations**
- Use strong database passwords
- Generate secure JWT secrets
- Enable SSL/TLS in production
- Use secrets management
- Regular security updates

### **Monitoring**
```bash
# Resource usage
docker stats

# Service status
docker-compose ps

# Health checks
docker-compose exec backend curl -f http://localhost:8080/api/locations
```

## 🔄 CI/CD Integration

### **GitHub Actions Example**
```yaml
name: Docker Build and Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and test
        run: |
          docker-compose build
          docker-compose up -d
          sleep 30
          curl -f http://localhost:8080/api/locations
```

## 📝 Maintenance

### **Regular Tasks**
```bash
# Update images
docker-compose pull

# Clean up unused resources
docker system prune -a

# Backup database regularly
docker-compose exec database pg_dump -U postgres community_support_system_db > backup-$(date +%Y%m%d).sql

# Monitor logs
docker-compose logs --tail=100 -f
```

### **Updates**
```bash
# Update application
git pull
docker-compose build --no-cache
docker-compose up -d

# Update database
# Backup first, then update image version in docker-compose.yml
```