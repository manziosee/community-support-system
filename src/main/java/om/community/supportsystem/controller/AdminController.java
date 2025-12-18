package om.community.supportsystem.controller;

import om.community.supportsystem.model.User;
import om.community.supportsystem.model.UserRole;
import om.community.supportsystem.service.UserService;
import om.community.supportsystem.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "👑 Admin Management", description = "Administrative operations for system management")
public class AdminController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private DashboardService dashboardService;
    
    @Operation(summary = "Get All Users with Pagination", description = "Get paginated list of all users for admin management")
    @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", example = "10")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field", example = "createdAt")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction", example = "desc")
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<User> users = userService.getAllUsersWithPagination(pageable);
        return ResponseEntity.ok(users);
    }
    
    @Operation(summary = "Lock User Account", description = "Lock a user account to prevent login")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Account locked successfully"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/users/{userId}/lock")
    public ResponseEntity<?> lockUserAccount(@PathVariable Long userId) {
        try {
            userService.lockUserAccount(userId);
            return ResponseEntity.ok(Map.of("message", "User account locked successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(summary = "Unlock User Account", description = "Unlock a user account to allow login")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Account unlocked successfully"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/users/{userId}/unlock")
    public ResponseEntity<?> unlockUserAccount(@PathVariable Long userId) {
        try {
            userService.unlockUserAccount(userId);
            return ResponseEntity.ok(Map.of("message", "User account unlocked successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(summary = "Change User Role", description = "Change a user's role (CITIZEN, VOLUNTEER, ADMIN)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Role changed successfully"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> changeUserRole(
            @PathVariable Long userId, 
            @RequestBody Map<String, String> request) {
        try {
            String roleStr = request.get("role");
            UserRole role = UserRole.valueOf(roleStr.toUpperCase());
            userService.changeUserRole(userId, role);
            return ResponseEntity.ok(Map.of("message", "User role changed successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid role specified"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(summary = "Get System Statistics", description = "Get comprehensive system statistics for admin dashboard")
    @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getSystemStatistics() {
        Map<String, Object> stats = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(stats);
    }
    
    @Operation(summary = "Reset User Password", description = "Admin can reset any user's password")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Password reset successfully"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/users/{userId}/reset-password")
    public ResponseEntity<?> resetUserPassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        try {
            String newPassword = request.get("password");
            userService.adminResetPassword(userId, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(summary = "Get User Details", description = "Get detailed information about a specific user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User details retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserDetails(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isPresent()) {
                return ResponseEntity.ok(userOpt.get());
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found with id: " + userId));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}