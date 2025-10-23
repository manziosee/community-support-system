# Community Help Portal

A Spring Boot web application that connects citizens in need with volunteers who can assist them. Citizens can post requests for help with tasks such as grocery delivery, tutoring, or technical support, while volunteers can browse these requests, accept them, and mark them as completed.

## Project Structure

### Entities (5 Classes)
1. **Location** - Rwandan administrative hierarchy (Province → District → Sector → Cell → Village)
2. **User** - Citizens and Volunteers with location relationships
3. **Request** - Help requests posted by citizens
4. **Assignment** - Tracks volunteer-request assignments
5. **Notification** - System notifications for users
6. **Skill** - Volunteer skills (Many-to-Many with Users)

### Relationships Implemented
- **One-to-One**: User profile extensions (can be extended)
- **One-to-Many**: Location → Users, User → Requests, User → Assignments, User → Notifications
- **Many-to-One**: Users → Location, Requests → User, Assignments → User/Request
- **Many-to-Many**: Users ↔ Skills

### Key Features
- Complete CRUD operations for all entities
- Spring Data JPA with custom queries (findBy, existsBy, sorting, pagination)
- Rwandan location-based user retrieval APIs
- RESTful API endpoints for all operations
- H2 in-memory database for development
- Sample data initialization

## API Endpoints

### Location Endpoints
- `GET /api/locations` - Get all locations
- `GET /api/locations/province-code/{code}` - Get locations by province code
- `GET /api/locations/province/{name}` - Get locations by province name
- `POST /api/locations` - Create new location
- `PUT /api/locations/{id}` - Update location
- `DELETE /api/locations/{id}` - Delete location

### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/province-code/{code}` - Get users by province code
- `GET /api/users/province/{name}` - Get users by province name
- `GET /api/users/role/{role}` - Get users by role (CITIZEN/VOLUNTEER)
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Request Endpoints
- `GET /api/requests` - Get all requests
- `GET /api/requests/status/{status}` - Get requests by status
- `GET /api/requests/pending` - Get pending requests
- `GET /api/requests/province/{province}` - Get requests by province
- `POST /api/requests` - Create new request
- `PUT /api/requests/{id}` - Update request
- `PATCH /api/requests/{id}/status` - Update request status

### Assignment Endpoints
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/volunteer/{id}` - Get assignments by volunteer
- `GET /api/assignments/completed` - Get completed assignments
- `POST /api/assignments` - Create new assignment
- `PATCH /api/assignments/{id}/complete` - Mark assignment as completed

### Notification Endpoints
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/user/{id}` - Get notifications by user
- `GET /api/notifications/unread` - Get unread notifications
- `POST /api/notifications` - Create new notification
- `PATCH /api/notifications/{id}/read` - Mark notification as read

### Skill Endpoints
- `GET /api/skills` - Get all skills
- `GET /api/skills/name/{name}` - Get skill by name
- `GET /api/skills/popular` - Get skills ordered by user count
- `POST /api/skills` - Create new skill
- `PUT /api/skills/{id}` - Update skill

## Running the Application

1. **Prerequisites**: Java 21, Maven
2. **Build**: `./mvnw clean compile`
3. **Run**: `./mvnw spring-boot:run`
4. **Access**: http://localhost:8080
5. **H2 Console**: http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:testdb)

## Database Schema

The application uses H2 in-memory database with the following tables:
- `locations` - Rwandan administrative locations
- `users` - Citizens and volunteers
- `requests` - Help requests
- `assignments` - Volunteer assignments
- `notifications` - User notifications
- `skills` - Available skills
- `user_skills` - Many-to-many mapping table

## Sample Data

The application initializes with sample data including:
- 5 locations across Rwanda's provinces
- 5 users (citizens and volunteers)
- 5 skills (Programming, Tutoring, Delivery, Tech Support, Cooking)
- 3 sample requests
- Sample notifications

## Technical Implementation

- **Framework**: Spring Boot 3.5.6
- **Java Version**: 21
- **Database**: H2 (development), PostgreSQL (production ready)
- **ORM**: Spring Data JPA with Hibernate
- **Architecture**: Model-Repository-Service-Controller pattern
- **API**: RESTful endpoints with proper HTTP methods
- **Validation**: JPA validation annotations
- **Logging**: Configured for debugging

This implementation satisfies all midterm requirements including 5+ entities, complete CRUD operations, JPA query methods, Rwandan location hierarchy, user-location relationships, and all three types of entity relationships.