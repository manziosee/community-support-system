# 🚀 Render Deployment Guide

## 📋 Prerequisites

- GitHub repository with your code
- Render account (free tier available)
- PostgreSQL database (Render provides free PostgreSQL)

## 🔧 Step-by-Step Deployment

### 1. Database Setup

1. **Create PostgreSQL Database on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "PostgreSQL"
   - Name: `community-support-db`
   - Plan: Free
   - Click "Create Database"

2. **Get Database Connection String:**
   - Copy the "External Database URL" from your database dashboard
   - Format: `postgresql://username:password@host:port/database`

### 2. Web Service Deployment

1. **Create Web Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `community-support-system`
     - **Runtime**: Java
     - **Build Command**: `mvn clean package -DskipTests`
     - **Start Command**: `java -Dspring.profiles.active=render -Dserver.port=$PORT -jar target/supportsystem-0.0.1-SNAPSHOT.jar`

2. **Environment Variables:**
   Set these in Render dashboard:
   ```
   SPRING_PROFILES_ACTIVE=render
   DATABASE_URL=[Your PostgreSQL External Database URL]
   JWT_SECRET=[Generate a secure 32+ character secret]
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   FRONTEND_URL=https://your-frontend.vercel.app
   SENDGRID_ENABLED=false
   ```

### 3. Using render.yaml (Recommended)

Place this `render.yaml` in your repository root:

```yaml
services:
  - type: web
    name: community-support-system
    env: java
    runtime: java21
    buildCommand: mvn clean package -DskipTests
    startCommand: java -Dspring.profiles.active=render -Dserver.port=$PORT -jar target/supportsystem-0.0.1-SNAPSHOT.jar
    healthCheckPath: /actuator/health
    plan: free
    envVars:
      - key: SPRING_PROFILES_ACTIVE
        value: render
      - key: DATABASE_URL
        fromDatabase:
          name: community-support-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ALLOWED_ORIGINS
        value: https://your-frontend.vercel.app
      - key: FRONTEND_URL
        value: https://your-frontend.vercel.app
      - key: SENDGRID_ENABLED
        value: false

databases:
  - name: community-support-db
    databaseName: community_support_system
    user: postgres
    plan: free
```

## 🔐 Security Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | JWT signing secret (32+ chars) | `your-secure-secret-key-here` |
| `CORS_ALLOWED_ORIGINS` | Frontend URLs | `https://your-app.vercel.app` |
| `FRONTEND_URL` | Main frontend URL | `https://your-app.vercel.app` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SENDGRID_ENABLED` | Enable email service | `false` |
| `SENDGRID_API_KEY` | SendGrid API key | - |
| `SENDGRID_FROM_EMAIL` | From email address | - |

## 🏥 Health Checks

The application includes health check endpoint:
- **URL**: `/actuator/health`
- **Method**: GET
- **Response**: `{"status":"UP"}`

## 📊 Monitoring

### Application Logs
```bash
# View logs in Render dashboard
# Or use Render CLI
render logs -s your-service-name
```

### Database Monitoring
- Monitor connection pool in Render dashboard
- Check database metrics and usage

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check Java version
   java -version
   # Should be Java 21
   ```

2. **Database Connection Issues**
   ```bash
   # Verify DATABASE_URL format
   postgresql://username:password@host:port/database
   ```

3. **Memory Issues**
   ```bash
   # Application uses -Xmx512m for Render free tier
   # Monitor memory usage in dashboard
   ```

### Debug Commands

```bash
# Check application status
curl https://your-app.onrender.com/actuator/health

# Test database connection
curl https://your-app.onrender.com/api/locations

# Check CORS configuration
curl -H "Origin: https://your-frontend.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS https://your-app.onrender.com/api/users
```

## 🔄 Deployment Updates

### Automatic Deployments
- Push to main branch triggers automatic deployment
- Monitor deployment progress in Render dashboard

### Manual Deployments
```bash
# Trigger manual deployment
render deploy -s your-service-name
```

## 📈 Performance Optimization

### Database Connection Pool
```properties
# Optimized for Render free tier
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.connection-timeout=30000
```

### JVM Memory Settings
```bash
# Optimized for 512MB RAM limit
java -Xmx512m -jar app.jar
```

## 🌐 Custom Domain (Optional)

1. **Add Custom Domain:**
   - Go to service settings
   - Add custom domain
   - Update DNS records

2. **SSL Certificate:**
   - Render provides free SSL certificates
   - Automatic renewal

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Spring Boot on Render](https://render.com/docs/deploy-spring-boot)
- [PostgreSQL on Render](https://render.com/docs/databases)