package om.community.supportsystem.controller;

import om.community.supportsystem.dto.UserResponseDTO;
import om.community.supportsystem.model.User;
import om.community.supportsystem.model.UserRole;
import om.community.supportsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@Tag(name = "👥 Users", description = "User management operations including CRUD, location-based queries, and skills management")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // Create
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Read
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserResponseDTO> userDTOs = users.stream()
            .map(UserResponseDTO::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<User> getUserByPhoneNumber(@PathVariable String phoneNumber) {
        return userService.getUserByPhoneNumber(phoneNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable UserRole role) {
        List<User> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/province-code/{provinceCode}")
    public ResponseEntity<List<User>> getUsersByProvinceCode(@PathVariable String provinceCode) {
        List<User> users = userService.getUsersByProvinceCode(provinceCode);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/province/{province}")
    public ResponseEntity<List<User>> getUsersByProvince(@PathVariable String province) {
        List<User> users = userService.getUsersByProvince(province);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/district/{district}")
    public ResponseEntity<List<User>> getUsersByDistrict(@PathVariable String district) {
        List<User> users = userService.getUsersByDistrict(district);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/location/{province}/{district}")
    public ResponseEntity<List<User>> getUsersByProvinceAndDistrict(
            @PathVariable String province, 
            @PathVariable String district) {
        List<User> users = userService.getUsersByProvinceAndDistrict(province, district);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/sector/{sector}")
    public ResponseEntity<List<User>> getUsersBySector(@PathVariable String sector) {
        List<User> users = userService.getUsersBySector(sector);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/cell/{cell}")
    public ResponseEntity<List<User>> getUsersByCell(@PathVariable String cell) {
        List<User> users = userService.getUsersByCell(cell);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/village/{village}")
    public ResponseEntity<List<User>> getUsersByVillage(@PathVariable String village) {
        List<User> users = userService.getUsersByVillage(village);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/volunteers/province/{province}")
    public ResponseEntity<List<User>> getVolunteersByProvince(@PathVariable String province) {
        List<User> volunteers = userService.getVolunteersByProvince(province);
        return ResponseEntity.ok(volunteers);
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) String province,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        
        try {
            if (query != null && !query.trim().isEmpty()) {
                // General search by name
                List<User> users = userService.searchUsersByName(query.trim());
                return ResponseEntity.ok(users);
            } else if (role != null && province != null) {
                // Search by role and province with pagination
                Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
                Page<User> users = userService.getUsersByRoleAndProvince(role, province, pageable);
                return ResponseEntity.ok(users);
            } else {
                // Return all users with pagination
                Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
                List<User> allUsers = userService.getAllUsers();
                return ResponseEntity.ok(allUsers);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/search/name/{name}")
    public ResponseEntity<List<User>> searchUsersByName(@PathVariable String name) {
        List<User> users = userService.searchUsersByName(name);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<User>> getRecentUsers(@RequestParam(defaultValue = "7") int days) {
        LocalDateTime date = LocalDateTime.now().minusDays(days);
        List<User> users = userService.getUsersCreatedAfter(date);
        return ResponseEntity.ok(users);
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    // Statistics endpoints
    @GetMapping("/count/volunteers")
    public ResponseEntity<Long> getTotalVolunteers() {
        long count = userService.getTotalVolunteers();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/count/citizens")
    public ResponseEntity<Long> getTotalCitizens() {
        long count = userService.getTotalCitizens();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/exists/email/{email}")
    public ResponseEntity<Boolean> existsByEmail(@PathVariable String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping("/exists/phone/{phoneNumber}")
    public ResponseEntity<Boolean> existsByPhoneNumber(@PathVariable String phoneNumber) {
        boolean exists = userService.existsByPhoneNumber(phoneNumber);
        return ResponseEntity.ok(exists);
    }
    
    // User Skills Management
    @Operation(summary = "Add skill to user", description = "Add a skill to a user's skill set (for volunteers)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Skill added successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request or skill already exists"),
        @ApiResponse(responseCode = "404", description = "User or skill not found")
    })
    @PostMapping("/{userId}/skills/{skillId}")
    public ResponseEntity<?> addSkillToUser(
            @Parameter(description = "User ID") @PathVariable Long userId, 
            @Parameter(description = "Skill ID to add") @PathVariable Long skillId) {
        try {
            User updatedUser = userService.addSkillToUser(userId, skillId);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(summary = "Remove skill from user", description = "Remove a skill from a user's skill set")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Skill removed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request or skill not found on user"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/{userId}/skills/{skillId}")
    public ResponseEntity<?> removeSkillFromUser(
            @Parameter(description = "User ID") @PathVariable Long userId, 
            @Parameter(description = "Skill ID to remove") @PathVariable Long skillId) {
        try {
            User updatedUser = userService.removeSkillFromUser(userId, skillId);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @Operation(summary = "Get user skills", description = "Retrieve all skills associated with a user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User skills retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{userId}/skills")
    public ResponseEntity<?> getUserSkills(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            return userService.getUserById(userId)
                    .map(user -> ResponseEntity.ok(user.getSkills()))
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}