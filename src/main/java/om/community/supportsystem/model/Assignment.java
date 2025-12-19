package om.community.supportsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignmentId;
    
    @Column(nullable = false)
    private LocalDateTime acceptedAt;
    
    private LocalDateTime completedAt;
    
    // Many-to-One: Many assignments belong to one request
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id", nullable = false)
    @JsonIgnoreProperties({"assignments", "citizen"})
    private Request request;
    
    // Many-to-One: Many assignments belong to one volunteer
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "volunteer_id", nullable = false)
    @JsonIgnoreProperties({"assignments", "requests", "notifications", "skills", "userSettings"})
    private User volunteer;
    
    // Constructors
    public Assignment() {
        this.acceptedAt = LocalDateTime.now();
    }
    
    public Assignment(Request request, User volunteer) {
        this.request = request;
        this.volunteer = volunteer;
        this.acceptedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }
    
    public LocalDateTime getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public Request getRequest() { return request; }
    public void setRequest(Request request) { this.request = request; }
    
    public User getVolunteer() { return volunteer; }
    public void setVolunteer(User volunteer) { this.volunteer = volunteer; }
}