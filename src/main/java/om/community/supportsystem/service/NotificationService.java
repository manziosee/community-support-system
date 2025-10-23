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
}