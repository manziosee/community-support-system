package om.community.supportsystem.controller;

import om.community.supportsystem.config.DataInitializer;
import om.community.supportsystem.repository.LocationRepository;
import om.community.supportsystem.repository.SkillRepository;
import om.community.supportsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@RestController
@RequestMapping("/api/admin-init")
@Tag(name = "🔧 Admin Initialization", description = "Manual data initialization for production environment")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class AdminInitController {
    
    @Autowired
    private DataInitializer dataInitializer;
    
    @Autowired
    private LocationRepository locationRepository;
    
    @Autowired
    private SkillRepository skillRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Operation(summary = "Check database status", description = "Check current database counts for locations, skills, and users")
    @ApiResponse(responseCode = "200", description = "Database status retrieved")
    @GetMapping("/status")
    public ResponseEntity<?> getDatabaseStatus() {
        try {
            long locationCount = locationRepository.count();
            long skillCount = skillRepository.count();
            long userCount = userRepository.count();
            long adminCount = userRepository.countByRole(om.community.supportsystem.model.UserRole.ADMIN);
            
            boolean hasAdmin = userRepository.existsByEmail("oseemanzi3@gmail.com");
            
            return ResponseEntity.ok(Map.of(
                "locations", locationCount,
                "skills", skillCount,
                "users", userCount,
                "admins", adminCount,
                "hasAdminUser", hasAdmin,
                "adminEmail", "oseemanzi3@gmail.com",
                "needsInitialization", locationCount == 0 || skillCount < 40 || !hasAdmin
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to get database status: " + e.getMessage()
            ));
        }
    }
    
    @Operation(summary = "Initialize database manually", description = "Manually trigger data initialization for production")
    @ApiResponse(responseCode = "200", description = "Database initialization completed")
    @PostMapping("/initialize")
    public ResponseEntity<?> initializeDatabase() {
        try {
            System.out.println("🔧 Manual database initialization requested...");
            
            // Force run the data initializer
            dataInitializer.run();
            
            // Get updated counts
            long locationCount = locationRepository.count();
            long skillCount = skillRepository.count();
            long userCount = userRepository.count();
            boolean hasAdmin = userRepository.existsByEmail("oseemanzi3@gmail.com");
            
            return ResponseEntity.ok(Map.of(
                "message", "Database initialization completed successfully",
                "locations", locationCount,
                "skills", skillCount,
                "users", userCount,
                "adminCreated", hasAdmin,
                "adminCredentials", Map.of(
                    "email", "oseemanzi3@gmail.com",
                    "password", "admin123",
                    "role", "ADMIN"
                )
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to initialize database: " + e.getMessage()
            ));
        }
    }
    
    @Operation(summary = "Reset admin password", description = "Reset the admin user password to default")
    @ApiResponse(responseCode = "200", description = "Admin password reset")
    @PostMapping("/reset-admin-password")
    public ResponseEntity<?> resetAdminPassword() {
        try {
            var adminUser = userRepository.findByEmail("oseemanzi3@gmail.com");
            if (adminUser.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Admin user not found. Please initialize database first."
                ));
            }
            
            // This would require UserService to reset password
            return ResponseEntity.ok(Map.of(
                "message", "Admin user exists",
                "email", "oseemanzi3@gmail.com",
                "note", "Use the manual reset URL method for password reset"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to reset admin password: " + e.getMessage()
            ));
        }
    }
}