package om.community.supportsystem.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("🤝 Community Support System API")
                        .version("1.0.0")
                        .description("## 🌟 Complete Backend Implementation\n\n" +
                                "A comprehensive REST API for connecting citizens in need with volunteers for community assistance in Rwanda.\n\n" +
                                "### ✅ **All Requirements Implemented:**\n" +
                                "1. **7 Entities** - User, Location, Request, Assignment, Notification, Skill, UserSkills\n" +
                                "2. **Role-based Authentication** - CITIZEN, VOLUNTEER, ADMIN with JWT\n" +
                                "3. **Password Reset via Email** - Complete email service with tokens\n" +
                                "4. **Two-Factor Authentication** - Email-based 2FA with 6-digit codes\n" +
                                "5. **Dashboard with Business Analytics** - Comprehensive statistics and KPIs\n" +
                                "6. **Pagination Support** - All endpoints support pagination and sorting\n" +
                                "7. **🇷🇼 Rwanda Locations API** - Complete 5-level administrative hierarchy\n\n" +
                                "### 🚀 **Key Features:**\n" +
                                "- **130+ REST Endpoints** with full CRUD operations\n" +
                                "- **JWT Authentication** with role-based access control\n" +
                                "- **Email Service** for notifications and 2FA\n" +
                                "- **Real-time Dashboard** with business intelligence\n" +
                                "- **Admin Management** tools for system administration\n" +
                                "- **Complete Security** with account lockout and encryption\n" +
                                "- **🇷🇼 Complete Location Hierarchy** - Province → District → Sector → Cell → Village\n" +
                                "- **External API Integration** - RDA Administrative Divisions API\n" +
                                "- **Comprehensive Testing** with integration tests\n\n" +
                                "### 📊 **Database Architecture:**\n" +
                                "- **PostgreSQL** production database\n" +
                                "- **7 tables** with complete relationships (1:1, 1:N, N:1, M:N)\n" +
                                "- **Foreign key constraints** and data integrity\n" +
                                "- **Optimized queries** with pagination and indexing\n" +
                                "- **Location fields** - Province, District, Sector, Cell, Village\n\n" +
                                "### 🇷🇼 **Rwanda Locations API:**\n" +
                                "- **Real-time data** from official RDA API\n" +
                                "- **5-level hierarchy** - Complete administrative structure\n" +
                                "- **Cascading endpoints** - Each level depends on previous selection\n" +
                                "- **External integration** - https://rda-ad-divisions.onrender.com\n\n" +
                                "### 🔐 **Authentication:**\n" +
                                "Use the **Authorize** button above to authenticate with JWT token.\n" +
                                "Get token from `/api/auth/login` endpoint.")
                        .contact(new Contact()
                                .name("Community Support Team")
                                .email("support@community.rw")
                                .url("https://github.com/manziosee/community-support-system"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("🔧 Development Server - Local Development"),
                        new Server()
                                .url("https://api.community.rw")
                                .description("🌐 Production Server - Live API")
                ))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT Authentication - Get token from /api/auth/login")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}