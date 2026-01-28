package om.community.supportsystem.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import java.util.List;
import java.util.Arrays;

@RestController
@Tag(name = "🏠 System Information", description = "General system information and health check endpoints")
public class HomeController {
    
    @Operation(summary = "API Welcome", description = "Welcome message with API overview and available endpoints")
    @ApiResponse(responseCode = "200", description = "API information retrieved successfully")
    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
            "message", "🤝 Community Support System API",
            "version", "1.0.0",
            "status", "Running",
            "description", "A platform connecting citizens in need with volunteers for community assistance",
            "documentation", Map.of(
                "api_base", "/api",
                "endpoints", Arrays.asList(
                    "/api/locations - Rwandan administrative locations",
                    "/api/users - User management (Citizens & Volunteers)",
                    "/api/requests - Help requests from citizens",
                    "/api/assignments - Volunteer assignments",
                    "/api/notifications - User notifications",
                    "/api/skills - Volunteer skills"
                )
            )
        );
    }
    
    @Operation(summary = "API Information", description = "Detailed API information including available endpoints and sample requests")
    @ApiResponse(responseCode = "200", description = "API information retrieved successfully")
    @GetMapping("/api")
    public Map<String, Object> apiInfo() {
        return Map.of(
            "api_name", "Community Support System API",
            "version", "v1",
            "total_endpoints", "85+",
            "entities", Arrays.asList("Users", "Locations", "Requests", "Assignments", "Notifications", "Skills"),
            "available_endpoints", Map.of(
                "locations", "/api/locations",
                "users", "/api/users", 
                "requests", "/api/requests",
                "assignments", "/api/assignments",
                "notifications", "/api/notifications",
                "skills", "/api/skills"
            ),
            "sample_requests", Map.of(
                "get_all_locations", "GET /api/locations",
                "get_all_skills", "GET /api/skills",
                "get_users_by_role", "GET /api/users/role/VOLUNTEER",
                "get_pending_requests", "GET /api/requests/pending"
            )
        );
    }
    
    @Operation(summary = "System Status", description = "Check the system status and basic information")
    @ApiResponse(responseCode = "200", description = "System is healthy")
    @GetMapping("/status")
    public Map<String, String> status() {
        return Map.of(
            "status", "UP",
            "database", "Connected",
            "server", "Running"
        );
    }
}