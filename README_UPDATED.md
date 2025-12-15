<div align="center">

# 🤝 Community Help Portal

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen?style=for-the-badge&logo=spring" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java" alt="Java">
  <img src="https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" alt="Docker">
</p>

<p align="center">
  <strong>🌟 A comprehensive full-stack web platform connecting citizens in need with volunteers for community assistance 🌟</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/2FA-Enabled-green?style=for-the-badge&logo=shield" alt="2FA">
  <img src="https://img.shields.io/badge/API-93%2B%20Endpoints-informational?style=for-the-badge" alt="API">
</p>

</div>

---

## 📋 Overview

The **Community Help Portal** is a full-stack web application that bridges the gap between citizens seeking assistance and volunteers ready to help. Built with Spring Boot backend and React frontend, featuring modern security with JWT authentication, Two-Factor Authentication, and comprehensive role-based access control.

## 🛠️ Technology Stack

<div align="center">

| Category | Technology | Version | Purpose |
|----------|------------|---------|----------|
| 🖥️ **Backend** | Spring Boot | 3.5.6 | Main framework |
| ☕ **Language** | Java | 21 | Programming language |
| ⚛️ **Frontend** | React | 19.2.0 | User interface |
| 📘 **Language** | TypeScript | 5.9+ | Type-safe frontend |
| 🗄️ **Database** | PostgreSQL | 16+ | Production database |
| 🔧 **ORM** | Hibernate/JPA | 6.x | Object-relational mapping |
| 📦 **Build Tool** | Maven/Vite | 3.9+/7.2+ | Dependency management |
| 🌐 **API** | REST | - | Web services |
| 🔐 **Security** | Spring Security + JWT | 6.x | Authentication & Authorization |
| 🐳 **Container** | Docker | 20.10+ | Containerization |

</div>

## ✨ Key Features

<div align="center">

| Feature | Description | Status |
|---------|-------------|--------|
| 🔄 **CRUD Operations** | Complete Create, Read, Update, Delete for all entities | ✅ |
| 🔍 **Advanced Queries** | findBy, existsBy, custom queries with @Query | ✅ |
| 📄 **Pagination & Sorting** | Efficient data retrieval with Spring Data | ✅ |
| 🏛️ **Location-based APIs** | Rwandan administrative hierarchy support | ✅ |
| 🌐 **RESTful Endpoints** | Complete API coverage for all operations | ✅ |
| 🔐 **JWT Authentication** | Secure token-based authentication | ✅ |
| 🛡️ **Two-Factor Auth** | Email-based 2FA with backup codes | ✅ |
| 🔑 **Password Reset** | Email-based password recovery | ✅ |
| 👥 **Role-Based Access** | Admin, Volunteer, Citizen roles | ✅ |
| 🔍 **Global Search** | Cross-system search functionality | ✅ |
| 📊 **Business Dashboard** | Real-time statistics and analytics | ✅ |
| 🐳 **Docker Ready** | Complete containerization | ✅ |
| 📱 **Responsive UI** | Modern React frontend | ✅ |

</div>

---

## 🎯 Test Users

<div align="center">

| Role | Email | Password | Features |
|------|-------|----------|----------|
| 👑 **Admin** | admin@community.rw | admin123 | 2FA Demo, Full System Access |
| 🤝 **Volunteer** | volunteer@community.rw | volunteer123 | Assignment Management |
| 👤 **Citizen** | citizen@community.rw | citizen123 | Request Creation |

</div>

---

## 🚀 Getting Started

### 🐳 Quick Start with Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/manziosee/community-support-system.git
cd community-support-system

# 2. Run complete system with Docker
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost
# Backend API: http://localhost:8080/api
```

### 📋 Manual Setup Prerequisites

<div align="center">

| Requirement | Version | Download Link |
|-------------|---------|---------------|
| ☕ **Java** | 21+ | [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) |
| 📦 **Maven** | 3.9+ | [Apache Maven](https://maven.apache.org/download.cgi) |
| 🗄️ **PostgreSQL** | 16+ | [PostgreSQL](https://www.postgresql.org/download/) |
| 🟢 **Node.js** | 18+ | [Node.js](https://nodejs.org/) |
| 🐳 **Docker** | 20.10+ | [Docker](https://www.docker.com/) |

</div>

### 🔧 Manual Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/manziosee/community-support-system.git
cd community-support-system

# 2. Setup Backend
psql -U postgres -c "CREATE DATABASE community_support_system_db;"
./mvnw clean compile
./mvnw spring-boot:run

# 3. Setup Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### 🌐 Access Points

<div align="center">

| Service | URL | Description |
|---------|-----|-------------|
| 🌐 **Frontend** | http://localhost (Docker) / http://localhost:5173 (Dev) | React Application |
| 📊 **Backend API** | http://localhost:8080/api | REST Endpoints |
| 📚 **Swagger UI** | http://localhost:8080/swagger-ui.html | API Documentation |
| 🗄️ **Database** | localhost:5432 | PostgreSQL Connection |

</div>

---

## 🐳 Docker Deployment

### Quick Start
```bash
# Complete system (Database + Backend + Frontend)
docker-compose up -d

# Backend only
docker build -t community-backend .
docker run -p 8080:8080 community-backend
```

### Services
- **Frontend**: http://localhost (Nginx + React)
- **Backend**: http://localhost:8080 (Spring Boot)
- **Database**: PostgreSQL with persistent volume

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for detailed instructions.

---

## 🎨 Full-Stack Architecture

<div align="center">

### 🏗️ System Architecture

```
🌐 React Frontend (TypeScript)
        ↓ (HTTP/REST)
🔒 Spring Security (JWT + 2FA)
        ↓
🌐 Controller Layer (REST APIs)
        ↓
💼 Service Layer (Business Logic)
        ↓
🗄️ Repository Layer (Data Access)
        ↓
📊 PostgreSQL Database
```

| Layer | Technology | Responsibility |
|-------|------------|----------------|
| **Frontend** | React 19 + TypeScript | User Interface, State Management |
| **Security** | Spring Security + JWT | Authentication, Authorization, 2FA |
| **Controller** | Spring Web | REST API endpoints, HTTP handling |
| **Service** | Spring Service | Business logic, validation |
| **Repository** | Spring Data JPA | Data access, queries |
| **Database** | PostgreSQL 16 | Data persistence, relationships |

</div>

---

## 🌐 API Endpoints (93+ Total Mappings)

### 🔐 Authentication & Security
- **Login/Register**: JWT-based authentication
- **2FA**: Email verification with backup codes
- **Password Reset**: Email-based recovery
- **Role-Based Access**: Admin, Volunteer, Citizen

### 🏛️ Core Entities (7 Tables)
- **Locations**: 30 Rwandan districts with province hierarchy
- **Users**: Citizens, Volunteers, Admins with location linking
- **Requests**: Help requests with status tracking
- **Assignments**: Volunteer-request matching
- **Notifications**: Real-time user notifications
- **Skills**: Volunteer capabilities
- **User_Skills**: Many-to-many skill mapping

### 📊 Advanced Features
- **Pagination**: All list endpoints support pagination
- **Search**: Global search across entities
- **Filtering**: Province-based and role-based filtering
- **Analytics**: Dashboard with business metrics

---

## 📚 Documentation

- **[API Documentation](http://localhost:8080/swagger-ui.html)** - Interactive Swagger UI
- **[Requirements Completion](frontend/REQUIREMENTS_COMPLETION.md)** - All 10 requirements verified
- **[Docker Deployment](DOCKER_DEPLOYMENT.md)** - Container deployment guide
- **[Frontend Progress](frontend/UI_ENHANCEMENT_PROGRESS.md)** - UI development status

---

## 🧪 Testing

### Postman Collection
Import `Community_Support_System_Updated.postman_collection.json` for complete API testing with:
- Authentication flows
- 2FA setup and verification
- All CRUD operations
- Admin functions
- Error handling

### Test Data
- **30 Locations**: Complete Rwandan administrative structure
- **Test Users**: Admin, Volunteer, Citizen accounts
- **10 Skills**: Programming, Healthcare, Education, etc.
- **Security Features**: JWT tokens, 2FA, password encryption

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for Rwanda's Communities**

*Connecting citizens and volunteers through technology*

</div>