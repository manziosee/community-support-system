package om.community.supportsystem.dto;

import java.util.Map;

public class DashboardStats {
    private long totalUsers;
    private long totalCitizens;
    private long totalVolunteers;
    private long totalAdmins;
    private long totalRequests;
    private long pendingRequests;
    private long acceptedRequests;
    private long completedRequests;
    private long totalAssignments;
    private long completedAssignments;
    private long pendingAssignments;
    private long totalNotifications;
    private long unreadNotifications;
    private long totalLocations;
    private long newUsersThisWeek;
    private long newRequestsThisWeek;
    private Map<String, Long> usersByProvince;
    private Map<String, Long> requestsByProvince;
    
    // Getters and setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    
    public long getTotalCitizens() { return totalCitizens; }
    public void setTotalCitizens(long totalCitizens) { this.totalCitizens = totalCitizens; }
    
    public long getTotalVolunteers() { return totalVolunteers; }
    public void setTotalVolunteers(long totalVolunteers) { this.totalVolunteers = totalVolunteers; }
    
    public long getTotalRequests() { return totalRequests; }
    public void setTotalRequests(long totalRequests) { this.totalRequests = totalRequests; }
    
    public long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; }
    
    public long getCompletedRequests() { return completedRequests; }
    public void setCompletedRequests(long completedRequests) { this.completedRequests = completedRequests; }
    
    public long getTotalAssignments() { return totalAssignments; }
    public void setTotalAssignments(long totalAssignments) { this.totalAssignments = totalAssignments; }
    
    public long getTotalAdmins() { return totalAdmins; }
    public void setTotalAdmins(long totalAdmins) { this.totalAdmins = totalAdmins; }
    
    public long getAcceptedRequests() { return acceptedRequests; }
    public void setAcceptedRequests(long acceptedRequests) { this.acceptedRequests = acceptedRequests; }
    
    public long getCompletedAssignments() { return completedAssignments; }
    public void setCompletedAssignments(long completedAssignments) { this.completedAssignments = completedAssignments; }
    
    public long getPendingAssignments() { return pendingAssignments; }
    public void setPendingAssignments(long pendingAssignments) { this.pendingAssignments = pendingAssignments; }
    
    public long getTotalNotifications() { return totalNotifications; }
    public void setTotalNotifications(long totalNotifications) { this.totalNotifications = totalNotifications; }
    
    public long getUnreadNotifications() { return unreadNotifications; }
    public void setUnreadNotifications(long unreadNotifications) { this.unreadNotifications = unreadNotifications; }
    
    public long getNewUsersThisWeek() { return newUsersThisWeek; }
    public void setNewUsersThisWeek(long newUsersThisWeek) { this.newUsersThisWeek = newUsersThisWeek; }
    
    public long getNewRequestsThisWeek() { return newRequestsThisWeek; }
    public void setNewRequestsThisWeek(long newRequestsThisWeek) { this.newRequestsThisWeek = newRequestsThisWeek; }
    
    public Map<String, Long> getUsersByProvince() { return usersByProvince; }
    public void setUsersByProvince(Map<String, Long> usersByProvince) { this.usersByProvince = usersByProvince; }
    
    public Map<String, Long> getRequestsByProvince() { return requestsByProvince; }
    public void setRequestsByProvince(Map<String, Long> requestsByProvince) { this.requestsByProvince = requestsByProvince; }
    
    public long getTotalLocations() { return totalLocations; }
    public void setTotalLocations(long totalLocations) { this.totalLocations = totalLocations; }
}