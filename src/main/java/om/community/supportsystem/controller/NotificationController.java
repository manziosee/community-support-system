package om.community.supportsystem.controller;

import om.community.supportsystem.model.Notification;
import om.community.supportsystem.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "🔔 Notifications", description = "Notification management APIs - user notifications, read status, and cleanup operations")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    // Create
    @Operation(summary = "Create notification", description = "Create a new notification for a user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notification created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid notification data")
    })
    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification createdNotification = notificationService.createNotification(notification);
        return ResponseEntity.ok(createdNotification);
    }
    
    // Read
    @Operation(summary = "Get all notifications", description = "Retrieve all notifications in the system")
    @ApiResponse(responseCode = "200", description = "Notifications retrieved successfully")
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = notificationService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        return notificationService.getNotificationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(summary = "Get notifications by user", description = "Retrieve all notifications for a specific user")
    @ApiResponse(responseCode = "200", description = "User notifications retrieved successfully")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUserId(
            @Parameter(description = "User ID", required = true) @PathVariable Long userId) {
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/user/{userId}/paginated")
    public ResponseEntity<List<Notification>> getNotificationsByUserPaginated(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications() {
        List<Notification> notifications = notificationService.getUnreadNotifications();
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotificationsByUserId(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getUnreadNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/search/message/{message}")
    public ResponseEntity<List<Notification>> searchNotificationsByMessage(@PathVariable String message) {
        List<Notification> notifications = notificationService.searchNotificationsByMessage(message);
        return ResponseEntity.ok(notifications);
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable Long id, @RequestBody Notification notificationDetails) {
        try {
            Notification updatedNotification = notificationService.updateNotification(id, notificationDetails);
            return ResponseEntity.ok(updatedNotification);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @Operation(summary = "Mark notification as read", description = "Mark a specific notification as read")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notification marked as read"),
        @ApiResponse(responseCode = "404", description = "Notification not found")
    })
    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @Parameter(description = "Notification ID", required = true) @PathVariable Long id) {
        try {
            Notification notification = notificationService.markAsRead(id);
            return ResponseEntity.ok(notification);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @Operation(summary = "Mark all notifications as read", description = "Mark all notifications as read for a specific user")
    @ApiResponse(responseCode = "200", description = "All notifications marked as read")
    @PatchMapping("/user/{userId}/mark-all-read")
    public ResponseEntity<Void> markAllAsReadForUser(
            @Parameter(description = "User ID", required = true) @PathVariable Long userId) {
        notificationService.markAllAsReadForUser(userId);
        return ResponseEntity.ok().build();
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/cleanup")
    public ResponseEntity<Void> deleteOldReadNotifications(@RequestParam(defaultValue = "30") int daysOld) {
        notificationService.deleteOldReadNotifications(daysOld);
        return ResponseEntity.noContent().build();
    }
    
    // Statistics
    @Operation(summary = "Count unread notifications", description = "Get the count of unread notifications for a user")
    @ApiResponse(responseCode = "200", description = "Unread notification count retrieved")
    @GetMapping("/user/{userId}/unread/count")
    public ResponseEntity<Long> countUnreadNotificationsByUser(
            @Parameter(description = "User ID", required = true) @PathVariable Long userId) {
        long count = notificationService.countUnreadNotificationsByUser(userId);
        return ResponseEntity.ok(count);
    }
}