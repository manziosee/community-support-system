package om.community.supportsystem.controller;

import om.community.supportsystem.model.User;
import om.community.supportsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // Create
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Read
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
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
    
    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable User.Role role) {
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
    
    @GetMapping("/volunteers/province/{province}")
    public ResponseEntity<List<User>> getVolunteersByProvince(@PathVariable String province) {
        List<User> volunteers = userService.getVolunteersByProvince(province);
        return ResponseEntity.ok(volunteers);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<User>> getUsersByRoleAndProvince(
            @RequestParam User.Role role,
            @RequestParam String province,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<User> users = userService.getUsersByRoleAndProvince(role, province, pageable);
        return ResponseEntity.ok(users);
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
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
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
}