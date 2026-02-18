package om.community.supportsystem.service;

import om.community.supportsystem.model.Notification;
import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private om.community.supportsystem.repository.UserRepository userRepository;
    
    // Create
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }
    
    public Notification createNotification(String message, User user) {
        Notification notification = new Notification(message, user);
        return notificationRepository.save(notification);
    }
    
    // Read
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
    
    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }
    
    public List<Notification> getNotificationsByUser(User user) {
        return notificationRepository.findByUser(user);
    }
    
    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserUserId(userId);
    }
    
    public List<Notification> getUnreadNotifications() {
        return notificationRepository.findByIsReadFalse();
    }
    
    public List<Notification> getUnreadNotificationsByUser(User user) {
        return notificationRepository.findByUserAndIsReadFalse(user);
    }
    
    public List<Notification> getUnreadNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserUserIdAndIsReadFalse(userId);
    }
    
    public List<Notification> getRecentNotificationsByUser(User user) {
        LocalDateTime dayAgo = LocalDateTime.now().minusDays(1);
        return notificationRepository.findRecentNotificationsByUser(user, dayAgo);
    }
    
    public Page<Notification> getNotificationsByUser(User user, Pageable pageable) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }
    
    public List<Notification> searchNotificationsByMessage(String message) {
        return notificationRepository.findByMessageContainingIgnoreCase(message);
    }
    
    // Update
    public Notification updateNotification(Long id, Notification notificationDetails) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    notification.setMessage(notificationDetails.getMessage());
                    notification.setIsRead(notificationDetails.getIsRead());
                    return notificationRepository.save(notification);
                })
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
    }
    
    public Notification markAsRead(Long id) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    notification.setIsRead(true);
                    return notificationRepository.save(notification);
                })
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
    }
    
    public void markAllAsReadForUser(User user) {
        List<Notification> unreadNotifications = notificationRepository.findByUserAndIsReadFalse(user);
        unreadNotifications.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
    
    public void markAllAsReadForUser(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserUserIdAndIsReadFalse(userId);
        unreadNotifications.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
    
    // Delete
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
    
    public void deleteOldReadNotifications(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        notificationRepository.deleteOldReadNotifications(cutoffDate);
    }
    
    // Utility methods
    public boolean existsByMessageAndUser(String message, User user) {
        return notificationRepository.existsByMessageAndUser(message, user);
    }
    
    public long countUnreadNotificationsByUser(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }
    
    public long countUnreadNotificationsByUser(Long userId) {
        return notificationRepository.countByUserUserIdAndIsReadFalse(userId);
    }
    
    public Page<Notification> searchNotifications(Long userId, Boolean isRead, String search, Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            if (isRead != null) {
                return notificationRepository.findByUserUserIdAndIsReadAndMessageContainingIgnoreCase(userId, isRead, search, pageable);
            }
            return notificationRepository.findByUserUserIdAndMessageContainingIgnoreCase(userId, search, pageable);
        }
        
        if (isRead != null) {
            return notificationRepository.findByUserUserIdAndIsRead(userId, isRead, pageable);
        }
        
        return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId, pageable);
    }
    
    public java.util.Map<String, Long> getUserNotificationStats(Long userId) {
        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("total", notificationRepository.countByUserUserId(userId));
        stats.put("unread", notificationRepository.countByUserUserIdAndIsReadFalse(userId));
        stats.put("read", notificationRepository.countByUserUserIdAndIsReadTrue(userId));
        return stats;
    }
    
    // Notify all volunteers about a new request
    public void notifyAllVolunteersAboutNewRequest(om.community.supportsystem.model.Request request) {
        // Get all volunteers from user repository
        List<User> volunteers = userRepository.findByRole(om.community.supportsystem.model.UserRole.VOLUNTEER);
        
        String message = String.format(
            "🆕 New Request: %s - %s (📍 %s, %s). Click to view details and accept.",
            request.getTitle(),
            request.getCategory(),
            request.getCitizen().getProvince(),
            request.getCitizen().getDistrict()
        );
        
        // Create notification for each volunteer
        volunteers.forEach(volunteer -> {
            Notification notification = new Notification(message, volunteer);
            notificationRepository.save(notification);
        });
        
        System.out.println("✅ Notified " + volunteers.size() + " volunteers about new request: " + request.getTitle());
    }
}