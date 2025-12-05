package om.community.supportsystem.controller;

import om.community.supportsystem.repository.AssignmentRepository;
import om.community.supportsystem.repository.NotificationRepository;
import om.community.supportsystem.repository.RequestRepository;
import om.community.supportsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/data")
public class DataController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RequestRepository requestRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private EntityManager entityManager;

    @DeleteMapping("/user/{userId}")
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (!userRepository.existsById(userId)) {
                response.put("success", false);
                response.put("message", "User not found with ID: " + userId);
                return ResponseEntity.status(404).body(response);
            }
            
            // Delete related data first
            entityManager.createNativeQuery("DELETE FROM assignments WHERE volunteer_user_id = ?1")
                .setParameter(1, userId).executeUpdate();
            entityManager.createNativeQuery("DELETE FROM notifications WHERE user_user_id = ?1")
                .setParameter(1, userId).executeUpdate();
            entityManager.createNativeQuery("DELETE FROM user_skills WHERE user_user_id = ?1")
                .setParameter(1, userId).executeUpdate();
            entityManager.createNativeQuery("DELETE FROM requests WHERE citizen_user_id = ?1")
                .setParameter(1, userId).executeUpdate();
            entityManager.createNativeQuery("DELETE FROM users WHERE user_id = ?1")
                .setParameter(1, userId).executeUpdate();
            entityManager.flush();
            
            response.put("success", true);
            response.put("message", "User deleted successfully");
            response.put("deletedUserId", userId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error deleting user: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/reset-database")
    @Transactional
    public ResponseEntity<Map<String, Object>> resetDatabase() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get counts before deletion
            long assignmentCount = assignmentRepository.count();
            long notificationCount = notificationRepository.count();
            long requestCount = requestRepository.count();
            long userCount = userRepository.count();
            
            // Delete all data
            entityManager.createNativeQuery("DELETE FROM assignments").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM notifications").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM user_skills").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM requests").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM users").executeUpdate();
            
            // Reset auto-increment sequences to start from 1
            entityManager.createNativeQuery("ALTER SEQUENCE assignments_assignment_id_seq RESTART WITH 1").executeUpdate();
            entityManager.createNativeQuery("ALTER SEQUENCE notifications_notification_id_seq RESTART WITH 1").executeUpdate();
            entityManager.createNativeQuery("ALTER SEQUENCE requests_request_id_seq RESTART WITH 1").executeUpdate();
            entityManager.createNativeQuery("ALTER SEQUENCE users_user_id_seq RESTART WITH 1").executeUpdate();
            
            entityManager.flush();
            
            response.put("success", true);
            response.put("message", "Database reset successfully - all IDs will start from 1");
            response.put("deletedCounts", Map.of(
                "assignments", assignmentCount,
                "notifications", notificationCount,
                "requests", requestCount,
                "users", userCount
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error resetting database: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/clear-all")
    @Transactional
    public ResponseEntity<Map<String, Object>> clearAllData() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get counts before deletion
            long assignmentCount = assignmentRepository.count();
            long notificationCount = notificationRepository.count();
            long requestCount = requestRepository.count();
            long userCount = userRepository.count();
            
            // Use native SQL to handle foreign key constraints
            entityManager.createNativeQuery("DELETE FROM assignments").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM notifications").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM user_skills").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM requests").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM users").executeUpdate();
            entityManager.flush();
            
            response.put("success", true);
            response.put("message", "All data cleared successfully (IDs not reset)");
            response.put("deletedCounts", Map.of(
                "assignments", assignmentCount,
                "notifications", notificationCount,
                "requests", requestCount,
                "users", userCount
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error clearing data: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}