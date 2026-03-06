package om.community.supportsystem.controller;

import om.community.supportsystem.model.Request;
import om.community.supportsystem.model.RequestStatus;
import om.community.supportsystem.model.User;
import om.community.supportsystem.service.AdminService;
import om.community.supportsystem.service.NotificationService;
import om.community.supportsystem.service.RequestService;
import om.community.supportsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "🔧 Admin", description = "Administrative operations")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002",
        "http://localhost:3003", "https://community-support-system.vercel.app"})
public class AdminController {

    @Autowired private AdminService adminService;
    @Autowired private RequestService requestService;
    @Autowired private UserService userService;
    @Autowired private NotificationService notificationService;

    @Operation(summary = "Get admin dashboard statistics")
    @ApiResponse(responseCode = "200", description = "Statistics retrieved")
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @Operation(summary = "Get system analytics")
    @ApiResponse(responseCode = "200", description = "Analytics retrieved")
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    // Alias used by frontend: GET /admin/analytics/reports
    @GetMapping("/analytics/reports")
    public ResponseEntity<Map<String, Object>> getAnalyticsReports() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @Operation(summary = "Get all requests (admin view)")
    @GetMapping("/requests/all")
    public ResponseEntity<?> getAllRequests() {
        try {
            List<Request> requests = requestService.getAllRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Moderate a request")
    @PatchMapping("/requests/{id}/moderate")
    public ResponseEntity<?> moderateRequest(@PathVariable Long id,
                                              @RequestBody Map<String, String> body) {
        try {
            String action = body.getOrDefault("action", "");
            RequestStatus status;
            switch (action.toUpperCase()) {
                case "APPROVE":  status = RequestStatus.ACCEPTED;  break;
                case "REJECT":   status = RequestStatus.CANCELLED; break;
                case "COMPLETE": status = RequestStatus.COMPLETED; break;
                default: return ResponseEntity.badRequest().body(Map.of("error", "Invalid action: " + action));
            }
            Request updated = requestService.updateRequestStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Update user status")
    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id,
                                               @RequestBody Map<String, String> body) {
        try {
            String status = body.getOrDefault("status", "");
            User user = userService.getUserById(id)
                    .orElseThrow(() -> new RuntimeException("User not found: " + id));
            switch (status.toUpperCase()) {
                case "LOCKED":   user.setAccountLocked(true);  break;
                case "UNLOCKED": user.setAccountLocked(false); break;
                default: break;
            }
            User saved = userService.updateUser(id, user);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Broadcast notification to all users")
    @PostMapping("/notifications/broadcast")
    public ResponseEntity<?> broadcastNotification(@RequestBody Map<String, String> body) {
        try {
            String message = body.get("message");
            if (message == null || message.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Message is required"));
            }
            List<User> users = userService.getAllUsers();
            int count = 0;
            for (User u : users) {
                notificationService.createNotification(message, u);
                count++;
            }
            return ResponseEntity.ok(Map.of("sent", count, "message", message));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Health check")
    @ApiResponse(responseCode = "200", description = "Admin API is healthy")
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Admin API is running");
    }
}
