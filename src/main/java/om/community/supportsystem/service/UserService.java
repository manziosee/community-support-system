package om.community.supportsystem.service;

import om.community.supportsystem.model.User;
import om.community.supportsystem.model.UserRole;
import om.community.supportsystem.model.UserSettings;
import om.community.supportsystem.model.Location;
import om.community.supportsystem.repository.UserRepository;
import om.community.supportsystem.repository.UserSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserSettingsRepository userSettingsRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Create
    public User createUser(User user) {
        // Validate required fields
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        
        if (user.getRole() == null) {
            throw new RuntimeException("Role is required (CITIZEN or VOLUNTEER)");
        }
        
        // Validate email uniqueness
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User with email " + user.getEmail() + " already exists");
        }
        
        // Validate phone number uniqueness and format
        if (user.getPhoneNumber() == null || !user.getPhoneNumber().matches("^[0-9]{10}$")) {
            throw new RuntimeException("Phone number must be exactly 10 digits");
        }
        
        if (userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new RuntimeException("User with phone number " + user.getPhoneNumber() + " already exists");
        }
        
        // Location will be handled by JPA automatically
        
        return userRepository.save(user);
    }
    
    // Read
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }
    
    public List<User> getUsersByProvinceCode(String provinceCode) {
        return userRepository.findByLocationProvinceCode(provinceCode);
    }
    
    public List<User> getUsersByProvince(String province) {
        return userRepository.findByLocationProvince(province);
    }
    
    public List<User> getVolunteersByProvince(String province) {
        return userRepository.findVolunteersByProvince(province);
    }
    
    public List<User> getUsersCreatedAfter(LocalDateTime date) {
        return userRepository.findByCreatedAtAfter(date);
    }
    
    public Page<User> getUsersByRoleAndProvince(UserRole role, String province, Pageable pageable) {
        return userRepository.findByRoleAndLocation_Province(role, province, pageable);
    }
    
    public List<User> searchUsersByName(String name) {
        return userRepository.findByNameContainingIgnoreCase(name);
    }
    
    // Update
    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(userDetails.getName());
                    user.setEmail(userDetails.getEmail());
                    user.setPhoneNumber(userDetails.getPhoneNumber());
                    user.setRole(userDetails.getRole());
                    
                    // Handle location update
                    if (userDetails.getLocation() != null) {
                        user.setLocation(userDetails.getLocation());
                    }
                    
                    user.setSector(userDetails.getSector());
                    user.setCell(userDetails.getCell());
                    user.setVillage(userDetails.getVillage());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    // Delete
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Check for related data
        if (user.getRequests() != null && !user.getRequests().isEmpty()) {
            throw new RuntimeException("Cannot delete user with existing requests. Please delete requests first.");
        }
        
        if (user.getAssignments() != null && !user.getAssignments().isEmpty()) {
            throw new RuntimeException("Cannot delete user with existing assignments. Please complete assignments first.");
        }
        
        userRepository.deleteById(id);
    }
    
    // Utility methods
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public boolean existsByPhoneNumber(String phoneNumber) {
        return userRepository.existsByPhoneNumber(phoneNumber);
    }
    
    public Optional<User> getUserByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber);
    }
    
    public long countUsersByRole(UserRole role) {
        return userRepository.countByRole(role);
    }
    
    public long getTotalVolunteers() {
        return userRepository.countByRole(UserRole.VOLUNTEER);
    }
    
    public long getTotalCitizens() {
        return userRepository.countByRole(UserRole.CITIZEN);
    }
    
    // Admin methods
    public Page<User> getAllUsersWithPagination(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
    
    public void lockUserAccount(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setAccountLocked(true);
        userRepository.save(user);
    }
    
    public void unlockUserAccount(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setAccountLocked(false);
        user.setFailedLoginAttempts(0);
        userRepository.save(user);
    }
    
    public void changeUserRole(Long userId, UserRole role) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setRole(role);
        userRepository.save(user);
    }
    
    public void adminResetPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setFailedLoginAttempts(0);
        user.setAccountLocked(false);
        userRepository.save(user);
    }
    
    // Settings methods
    public void updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        if (!user.verifyPassword(currentPassword, passwordEncoder)) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
    public void updateNotificationPreferences(Long userId, Map<String, Boolean> preferences) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        UserSettings settings = user.getUserSettings();
        if (settings == null) {
            settings = new UserSettings();
            settings.setUser(user);
        }
        
        if (preferences.containsKey("emailNotifications")) {
            settings.setEmailNotifications(preferences.get("emailNotifications"));
        }
        if (preferences.containsKey("pushNotifications")) {
            settings.setPushNotifications(preferences.get("pushNotifications"));
        }
        if (preferences.containsKey("requestUpdates")) {
            settings.setRequestUpdates(preferences.get("requestUpdates"));
        }
        if (preferences.containsKey("assignmentUpdates")) {
            settings.setAssignmentUpdates(preferences.get("assignmentUpdates"));
        }
        
        userSettingsRepository.save(settings);
    }
    
    public Map<String, Object> getUserSettings(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Map<String, Object> settings = new HashMap<>();
        settings.put("name", user.getName());
        settings.put("phoneNumber", user.getPhoneNumber());
        settings.put("sector", user.getSector());
        settings.put("cell", user.getCell());
        settings.put("village", user.getVillage());
        
        UserSettings userSettings = user.getUserSettings();
        if (userSettings != null) {
            settings.put("emailNotifications", userSettings.getEmailNotifications());
            settings.put("pushNotifications", userSettings.getPushNotifications());
            settings.put("requestUpdates", userSettings.getRequestUpdates());
            settings.put("assignmentUpdates", userSettings.getAssignmentUpdates());
        } else {
            settings.put("emailNotifications", true);
            settings.put("pushNotifications", true);
            settings.put("requestUpdates", true);
            settings.put("assignmentUpdates", true);
        }
        
        return settings;
    }
    
    public void updateProfile(Long userId, Map<String, Object> profileData) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        if (profileData.containsKey("name")) {
            user.setName((String) profileData.get("name"));
        }
        if (profileData.containsKey("phoneNumber")) {
            String phoneNumber = (String) profileData.get("phoneNumber");
            if (userRepository.existsByPhoneNumber(phoneNumber) && 
                !phoneNumber.equals(user.getPhoneNumber())) {
                throw new RuntimeException("Phone number already exists");
            }
            user.setPhoneNumber(phoneNumber);
        }
        if (profileData.containsKey("sector")) {
            user.setSector((String) profileData.get("sector"));
        }
        if (profileData.containsKey("cell")) {
            user.setCell((String) profileData.get("cell"));
        }
        if (profileData.containsKey("village")) {
            user.setVillage((String) profileData.get("village"));
        }
        
        userRepository.save(user);
    }
}