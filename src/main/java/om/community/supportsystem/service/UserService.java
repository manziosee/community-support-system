package om.community.supportsystem.service;

import om.community.supportsystem.model.User;
import om.community.supportsystem.model.UserRole;
import om.community.supportsystem.model.Location;
import om.community.supportsystem.repository.UserRepository;
import om.community.supportsystem.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LocationService locationService;
    
    // Create
    public User createUser(User user) {
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
        
        // Ensure location is properly loaded
        if (user.getLocation() != null && user.getLocation().getLocationId() != null) {
            Location location = locationService.getLocationById(user.getLocation().getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found with id: " + user.getLocation().getLocationId()));
            user.setLocation(location);
        }
        
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
                    if (userDetails.getLocation() != null && userDetails.getLocation().getLocationId() != null) {
                        Location location = locationService.getLocationById(userDetails.getLocation().getLocationId())
                            .orElseThrow(() -> new RuntimeException("Location not found with id: " + userDetails.getLocation().getLocationId()));
                        user.setLocation(location);
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
}