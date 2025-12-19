package om.community.supportsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "requests")
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 1000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestCategory category;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Many-to-One: Many requests belong to one citizen
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "citizen_id", nullable = false)
    @JsonIgnoreProperties({"requests", "assignments", "notifications", "password", "emailVerificationToken", "passwordResetToken", "twoFactorSecret", "twoFactorBackupCodes"})
    private User citizen;
    
    // One-to-Many: One request can have many assignments (history)
    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Assignment> assignments;
    

    
    // Constructors
    public Request() {
        this.createdAt = LocalDateTime.now();
        this.status = RequestStatus.PENDING;
        this.category = RequestCategory.GENERAL_HELP;
    }
    
    public Request(String title, String description, RequestCategory category, User citizen) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.citizen = citizen;
        this.createdAt = LocalDateTime.now();
        this.status = RequestStatus.PENDING;
    }
    
    // Getters and Setters
    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public RequestCategory getCategory() { return category; }
    public void setCategory(RequestCategory category) { this.category = category; }
    
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { 
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public User getCitizen() { return citizen; }
    public void setCitizen(User citizen) { this.citizen = citizen; }
    
    public List<Assignment> getAssignments() { return assignments; }
    public void setAssignments(List<Assignment> assignments) { this.assignments = assignments; }
}