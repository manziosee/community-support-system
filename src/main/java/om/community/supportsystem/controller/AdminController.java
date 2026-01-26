package om.community.supportsystem.controller;

import om.community.supportsystem.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "🔧 Admin", description = "Administrative operations - dashboard statistics, analytics, and system management")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "https://community-support-system.vercel.app"})
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Operation(summary = "Get admin dashboard statistics", description = "Retrieve comprehensive system statistics for admin dashboard")
    @ApiResponse(responseCode = "200", description = "Dashboard statistics retrieved successfully")
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "Get system analytics", description = "Retrieve detailed analytics and metrics for system performance")
    @ApiResponse(responseCode = "200", description = "Analytics data retrieved successfully")
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> analytics = adminService.getAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @Operation(summary = "Health check", description = "Check if admin API is running and accessible")
    @ApiResponse(responseCode = "200", description = "Admin API is healthy")
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Admin API is running");
    }
}