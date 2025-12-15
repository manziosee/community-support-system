package om.community.supportsystem.service;

import om.community.supportsystem.dto.DashboardStats;
import om.community.supportsystem.model.RequestStatus;
import om.community.supportsystem.model.UserRole;
import om.community.supportsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RequestRepository requestRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private LocationRepository locationRepository;
    
    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        
        // User statistics
        stats.setTotalUsers(userRepository.count());
        stats.setTotalCitizens(userRepository.countByRole(UserRole.CITIZEN));
        stats.setTotalVolunteers(userRepository.countByRole(UserRole.VOLUNTEER));
        stats.setTotalAdmins(userRepository.countByRole(UserRole.ADMIN));
        
        // Request statistics
        stats.setTotalRequests(requestRepository.count());
        stats.setPendingRequests(requestRepository.countByStatus(RequestStatus.PENDING));
        stats.setAcceptedRequests(requestRepository.countByStatus(RequestStatus.ACCEPTED));
        stats.setCompletedRequests(requestRepository.countByStatus(RequestStatus.COMPLETED));
        
        // Assignment statistics
        stats.setTotalAssignments(assignmentRepository.count());
        stats.setCompletedAssignments(assignmentRepository.countByCompletedAtIsNotNull());
        stats.setPendingAssignments(assignmentRepository.countByCompletedAtIsNull());
        
        // Notification statistics
        stats.setTotalNotifications(notificationRepository.count());
        stats.setUnreadNotifications(notificationRepository.countByIsReadFalse());
        
        // Location statistics
        stats.setTotalLocations(locationRepository.count());
        
        // Recent activity (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        stats.setNewUsersThisWeek(userRepository.findByCreatedAtAfter(weekAgo).size());
        stats.setNewRequestsThisWeek(requestRepository.findByCreatedAtAfter(weekAgo).size());
        
        // Province-wise statistics
        Map<String, Long> usersByProvince = new HashMap<>();
        Map<String, Long> requestsByProvince = new HashMap<>();
        
        locationRepository.findAll().forEach(location -> {
            String province = location.getProvince();
            usersByProvince.put(province, (long) location.getUsers().size());
            requestsByProvince.put(province, 
                location.getUsers().stream()
                    .mapToLong(user -> user.getRequests().size())
                    .sum());
        });
        
        stats.setUsersByProvince(usersByProvince);
        stats.setRequestsByProvince(requestsByProvince);
        
        return stats;
    }
    
    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        DashboardStats stats = getDashboardStats();
        dashboard.put("stats", stats);
        
        // System health metrics
        Map<String, Object> systemHealth = new HashMap<>();
        systemHealth.put("activeUsers", userRepository.countByAccountLockedFalse());
        systemHealth.put("lockedAccounts", userRepository.countByAccountLockedTrue());
        systemHealth.put("verifiedEmails", userRepository.countByEmailVerifiedTrue());
        systemHealth.put("unverifiedEmails", userRepository.countByEmailVerifiedFalse());
        systemHealth.put("twoFactorEnabled", userRepository.countByTwoFactorEnabledTrue());
        systemHealth.put("totalNotifications", stats.getTotalNotifications());
        systemHealth.put("readNotifications", notificationRepository.countByIsReadTrue());
        
        dashboard.put("systemHealth", systemHealth);
        
        return dashboard;
    }
}