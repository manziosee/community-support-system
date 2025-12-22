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
}