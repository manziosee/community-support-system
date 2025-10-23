package om.community.supportsystem.service;

import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.UserRepository;
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
    
    // Create
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User with email " + user.getEmail() + " already exists");
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
    
    public List<User> getUsersByRole(User.Role role) {
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
    
    public Page<User> getUsersByRoleAndProvince(User.Role role, String province, Pageable pageable) {
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
                    user.setRole(userDetails.getRole());
                    user.setLocation(userDetails.getLocation());
                    if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                        user.setPassword(userDetails.getPassword());
                    }
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    // Delete
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    // Utility methods
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public long countUsersByRole(User.Role role) {
        return userRepository.countByRole(role);
    }
    
    public long getTotalVolunteers() {
        return userRepository.countByRole(User.Role.VOLUNTEER);
    }
    
    public long getTotalCitizens() {
        return userRepository.countByRole(User.Role.CITIZEN);
    }
}