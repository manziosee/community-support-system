package om.community.supportsystem.repository;

import om.community.supportsystem.model.Notification;
import om.community.supportsystem.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Find by user
    List<Notification> findByUser(User user);
    
    // Find by user ID
    List<Notification> findByUserUserId(Long userId);
    
    // Find unread notifications
    List<Notification> findByIsReadFalse();
    
    // Find unread notifications by user
    List<Notification> findByUserAndIsReadFalse(User user);
    
    // Find read notifications
    List<Notification> findByIsReadTrue();
    
    // Check if notification exists by message and user
    boolean existsByMessageAndUser(String message, User user);
    
    // Find notifications created after specific date
    List<Notification> findByCreatedAtAfter(LocalDateTime date);
    
    // Find with pagination and sorting
    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    // Count unread notifications by user
    long countByUserAndIsReadFalse(User user);
    
    // Find notifications by message containing (case insensitive)
    List<Notification> findByMessageContainingIgnoreCase(String message);
    
    // Find recent notifications for user (last 24 hours)
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.createdAt >= :dayAgo ORDER BY n.createdAt DESC")
    List<Notification> findRecentNotificationsByUser(@Param("user") User user, @Param("dayAgo") LocalDateTime dayAgo);
    
    // Delete old read notifications
    @Query("DELETE FROM Notification n WHERE n.isRead = true AND n.createdAt < :cutoffDate")
    void deleteOldReadNotifications(@Param("cutoffDate") LocalDateTime cutoffDate);
}