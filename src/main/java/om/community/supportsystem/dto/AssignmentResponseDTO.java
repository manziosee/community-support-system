package om.community.supportsystem.dto;

import om.community.supportsystem.model.Assignment;
import java.time.LocalDateTime;

public class AssignmentResponseDTO {
    private Long assignmentId;
    private LocalDateTime acceptedAt;
    private LocalDateTime completedAt;
    private boolean completed;
    
    // Volunteer info
    private Long volunteerId;
    private String volunteerName;
    private String volunteerEmail;
    private String volunteerPhone;
    
    // Request info
    private Long requestId;
    private String requestTitle;
    private String requestDescription;
    private String requestCategory;
    private String requestStatus;
    
    // Citizen info
    private Long citizenId;
    private String citizenName;
    private String citizenEmail;
    
    // Nested objects for backward compatibility
    private VolunteerInfo volunteer;
    private CitizenInfo citizen;
    private RequestInfo request;
    
    public AssignmentResponseDTO(Assignment assignment) {
        this.assignmentId = assignment.getAssignmentId();
        this.acceptedAt = assignment.getAcceptedAt();
        this.completedAt = assignment.getCompletedAt();
        this.completed = assignment.getCompletedAt() != null;
        
        // Volunteer info
        if (assignment.getVolunteer() != null) {
            this.volunteerId = assignment.getVolunteer().getUserId();
            this.volunteerName = assignment.getVolunteer().getName();
            this.volunteerEmail = assignment.getVolunteer().getEmail();
            this.volunteerPhone = assignment.getVolunteer().getPhoneNumber();
        }
        
        // Request info
        if (assignment.getRequest() != null) {
            this.requestId = assignment.getRequest().getRequestId();
            this.requestTitle = assignment.getRequest().getTitle();
            this.requestDescription = assignment.getRequest().getDescription();
            this.requestCategory = assignment.getRequest().getCategory() != null ? 
                assignment.getRequest().getCategory().toString() : null;
            this.requestStatus = assignment.getRequest().getStatus() != null ? 
                assignment.getRequest().getStatus().toString() : null;
                
            // Citizen info from request
            if (assignment.getRequest().getCitizen() != null) {
                this.citizenId = assignment.getRequest().getCitizen().getUserId();
                this.citizenName = assignment.getRequest().getCitizen().getName();
                this.citizenEmail = assignment.getRequest().getCitizen().getEmail();
            }
        }
        
        // Create nested objects for frontend compatibility
        this.volunteer = new VolunteerInfo(this.volunteerId, this.volunteerName, this.volunteerEmail, this.volunteerPhone);
        this.citizen = new CitizenInfo(this.citizenId, this.citizenName, this.citizenEmail);
        this.request = new RequestInfo(this.requestId, this.requestTitle, this.requestDescription, this.requestCategory, this.requestStatus);
    }
    
    // Getters and setters
    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }
    
    public LocalDateTime getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    
    public Long getVolunteerId() { return volunteerId; }
    public void setVolunteerId(Long volunteerId) { this.volunteerId = volunteerId; }
    
    public String getVolunteerName() { return volunteerName; }
    public void setVolunteerName(String volunteerName) { this.volunteerName = volunteerName; }
    
    public String getVolunteerEmail() { return volunteerEmail; }
    public void setVolunteerEmail(String volunteerEmail) { this.volunteerEmail = volunteerEmail; }
    
    public String getVolunteerPhone() { return volunteerPhone; }
    public void setVolunteerPhone(String volunteerPhone) { this.volunteerPhone = volunteerPhone; }
    
    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }
    
    public String getRequestTitle() { return requestTitle; }
    public void setRequestTitle(String requestTitle) { this.requestTitle = requestTitle; }
    
    public String getRequestDescription() { return requestDescription; }
    public void setRequestDescription(String requestDescription) { this.requestDescription = requestDescription; }
    
    public String getRequestCategory() { return requestCategory; }
    public void setRequestCategory(String requestCategory) { this.requestCategory = requestCategory; }
    
    public String getRequestStatus() { return requestStatus; }
    public void setRequestStatus(String requestStatus) { this.requestStatus = requestStatus; }
    
    public Long getCitizenId() { return citizenId; }
    public void setCitizenId(Long citizenId) { this.citizenId = citizenId; }
    
    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }
    
    public String getCitizenEmail() { return citizenEmail; }
    public void setCitizenEmail(String citizenEmail) { this.citizenEmail = citizenEmail; }
    
    // Convenience method for frontend - provides 'name' property
    public String getName() { return volunteerName; }
    
    // Additional convenience methods for different name contexts
    public String getVolunteerDisplayName() { return volunteerName; }
    public String getCitizenDisplayName() { return citizenName; }
    
    public VolunteerInfo getVolunteer() { return volunteer; }
    public void setVolunteer(VolunteerInfo volunteer) { this.volunteer = volunteer; }
    
    public CitizenInfo getCitizen() { return citizen; }
    public void setCitizen(CitizenInfo citizen) { this.citizen = citizen; }
    
    public RequestInfo getRequest() { return request; }
    public void setRequest(RequestInfo request) { this.request = request; }
    
    // Nested classes for frontend compatibility
    public static class VolunteerInfo {
        private Long userId;
        private String name;
        private String email;
        private String phoneNumber;
        
        public VolunteerInfo(Long userId, String name, String email, String phoneNumber) {
            this.userId = userId;
            this.name = name != null ? name : "Unknown";
            this.email = email;
            this.phoneNumber = phoneNumber;
        }
        
        public Long getUserId() { return userId; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getPhoneNumber() { return phoneNumber; }
    }
    
    public static class CitizenInfo {
        private Long userId;
        private String name;
        private String email;
        
        public CitizenInfo(Long userId, String name, String email) {
            this.userId = userId;
            this.name = name != null ? name : "Unknown";
            this.email = email;
        }
        
        public Long getUserId() { return userId; }
        public String getName() { return name; }
        public String getEmail() { return email; }
    }
    
    public static class RequestInfo {
        private Long requestId;
        private String title;
        private String description;
        private String category;
        private String status;
        
        public RequestInfo(Long requestId, String title, String description, String category, String status) {
            this.requestId = requestId;
            this.title = title != null ? title : "Unknown";
            this.description = description;
            this.category = category;
            this.status = status;
        }
        
        public Long getRequestId() { return requestId; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getCategory() { return category; }
        public String getStatus() { return status; }
    }
}