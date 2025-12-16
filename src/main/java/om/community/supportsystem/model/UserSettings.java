package om.community.supportsystem.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_settings")
public class UserSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long settingsId;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Column(nullable = false)
    private Boolean emailNotifications = true;
    
    @Column(nullable = false)
    private Boolean pushNotifications = true;
    
    @Column(nullable = false)
    private Boolean requestUpdates = true;
    
    @Column(nullable = false)
    private Boolean assignmentUpdates = true;
    
    // Constructors
    public UserSettings() {}
    
    public UserSettings(User user) {
        this.user = user;
        this.emailNotifications = true;
        this.pushNotifications = true;
        this.requestUpdates = true;
        this.assignmentUpdates = true;
    }
    
    // Getters and Setters
    public Long getSettingsId() { return settingsId; }
    public void setSettingsId(Long settingsId) { this.settingsId = settingsId; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Boolean getEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(Boolean emailNotifications) { this.emailNotifications = emailNotifications; }
    
    public Boolean getPushNotifications() { return pushNotifications; }
    public void setPushNotifications(Boolean pushNotifications) { this.pushNotifications = pushNotifications; }
    
    public Boolean getRequestUpdates() { return requestUpdates; }
    public void setRequestUpdates(Boolean requestUpdates) { this.requestUpdates = requestUpdates; }
    
    public Boolean getAssignmentUpdates() { return assignmentUpdates; }
    public void setAssignmentUpdates(Boolean assignmentUpdates) { this.assignmentUpdates = assignmentUpdates; }
}