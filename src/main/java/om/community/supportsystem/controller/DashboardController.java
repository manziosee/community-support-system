package om.community.supportsystem.controller;

import om.community.supportsystem.dto.DashboardStats;
import om.community.supportsystem.model.RequestStatus;
import om.community.supportsystem.model.UserRole;
import om.community.supportsystem.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "📊 Dashboard", description = "Business information summary and analytics for different user roles")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @Autowired
    private RequestService requestService;
    
    @Autowired
    private AssignmentService assignmentService;
    
    @Operation(summary = "Get Dashboard Statistics", description = "Get comprehensive business statistics for dashboard")
    @ApiResponse(responseCode = "200", description = "Dashboard statistics retrieved successfully")
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        DashboardStats stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
    
    @Operation(summary = "Get Admin Dashboard", description = "Get comprehensive admin dashboard with all system metrics")
    @ApiResponse(responseCode = "200", description = "Admin dashboard data retrieved successfully")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> getAdminDashboard() {
        Map<String, Object> adminDashboard = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(adminDashboard);
    }
    
    @Operation(summary = "Get Citizen Dashboard", description = "Get citizen-specific dashboard statistics")
    @ApiResponse(responseCode = "200", description = "Citizen dashboard data retrieved successfully")
    @PreAuthorize("hasRole('CITIZEN')")
    @GetMapping("/citizen/{userId}")
    public ResponseEntity<?> getCitizenDashboard(@PathVariable Long userId) {
        try {
            DashboardStats stats = new DashboardStats();
            
            // Citizen-specific stats
            stats.setTotalRequests(requestService.getRequestsByCitizenId(userId).size());
            stats.setPendingRequests(requestService.getRequestsByCitizenId(userId).stream()
                .mapToLong(r -> r.getStatus() == RequestStatus.PENDING ? 1 : 0).sum());
            stats.setCompletedRequests(requestService.getRequestsByCitizenId(userId).stream()
                .mapToLong(r -> r.getStatus() == RequestStatus.COMPLETED ? 1 : 0).sum());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving citizen dashboard");
        }
    }
    
    @Operation(summary = "Get Volunteer Dashboard", description = "Get volunteer-specific dashboard statistics")
    @ApiResponse(responseCode = "200", description = "Volunteer dashboard data retrieved successfully")
    @PreAuthorize("hasRole('VOLUNTEER')")
    @GetMapping("/volunteer/{userId}")
    public ResponseEntity<?> getVolunteerDashboard(@PathVariable Long userId) {
        try {
            DashboardStats stats = new DashboardStats();
            
            // Volunteer-specific stats
            stats.setTotalAssignments(assignmentService.getAssignmentsByVolunteerId(userId).size());
            stats.setPendingAssignments(assignmentService.getAssignmentsByVolunteerId(userId).stream()
                .mapToLong(a -> a.getCompletedAt() == null ? 1 : 0).sum());
            stats.setCompletedRequests(assignmentService.getAssignmentsByVolunteerId(userId).stream()
                .mapToLong(a -> a.getCompletedAt() != null ? 1 : 0).sum());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving volunteer dashboard");
        }
    }
}