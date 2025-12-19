package om.community.supportsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false, length = 10, unique = true)
    private String phoneNumber;
    
    @JsonIgnore
    @Column(nullable = false, length = 255)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    // Authentication fields
    @Column(nullable = false)
    private boolean emailVerified = false;
    
    @JsonIgnore
    @Column(length = 255)
    private String emailVerificationToken;
    
    @JsonIgnore
    @Column(length = 255)
    private String passwordResetToken;
    
    private LocalDateTime passwordResetTokenExpiry;
    
    @JsonIgnore
    @Column(length = 255)
    private String twoFactorSecret;
    
    @Column(nullable = false)
    private boolean twoFactorEnabled = false;
    
    @JsonIgnore
    @Column(length = 1000)
    private String twoFactorBackupCodes;
    
    @Column(nullable = false)
    private boolean accountLocked = false;
    
    @Column(nullable = false)
    private int failedLoginAttempts = 0;
    
    private LocalDateTime lastLoginAt;
    
    // Many-to-One: Many users belong to one location
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id")
    @JsonIgnoreProperties({"users"})
    private Location location;
    
    // User-specific location details
    private String province;
    private String district;
    private String sector;
    private String cell;
    private String village;
    
    // One-to-Many: One citizen can have many requests
    @OneToMany(mappedBy = "citizen", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Request> requests;
    
    // One-to-Many: One volunteer can have many assignments
    @OneToMany(mappedBy = "volunteer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Assignment> assignments;
    
    // One-to-Many: One user can have many notifications
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Notification> notifications;
    
    // Many-to-Many: Users can have multiple skills (for volunteers)
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_skills",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @JsonIgnoreProperties({"users"})
    private Set<Skill> skills;
    
    // One-to-One: User settings for notification preferences
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private UserSettings userSettings;
    

    
    // Constructors
    public User() {
        this.createdAt = LocalDateTime.now();
    }
    
    public User(String name, String email, String phoneNumber, UserRole role, Location location) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.location = location;
        this.createdAt = LocalDateTime.now();
    }
    
    public User(String name, String email, String phoneNumber, UserRole role, Location location, String province, String district, String sector, String cell, String village) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.location = location;
        this.province = province;
        this.district = district;
        this.sector = sector;
        this.cell = cell;
        this.village = village;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }
    
    public List<Request> getRequests() { return requests; }
    public void setRequests(List<Request> requests) { this.requests = requests; }
    
    public List<Assignment> getAssignments() { return assignments; }
    public void setAssignments(List<Assignment> assignments) { this.assignments = assignments; }
    
    public List<Notification> getNotifications() { return notifications; }
    public void setNotifications(List<Notification> notifications) { this.notifications = notifications; }
    
    public Set<Skill> getSkills() { return skills; }
    public void setSkills(Set<Skill> skills) { this.skills = skills; }
    
    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }
    
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    
    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }
    
    public String getCell() { return cell; }
    public void setCell(String cell) { this.cell = cell; }
    
    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }
    
    // Authentication getters and setters (password getter removed for security)
    public void setPassword(String password) { this.password = password; }
    
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    
    public String getEmailVerificationToken() { return emailVerificationToken; }
    public void setEmailVerificationToken(String emailVerificationToken) { this.emailVerificationToken = emailVerificationToken; }
    
    public String getPasswordResetToken() { return passwordResetToken; }
    public void setPasswordResetToken(String passwordResetToken) { this.passwordResetToken = passwordResetToken; }
    
    public LocalDateTime getPasswordResetTokenExpiry() { return passwordResetTokenExpiry; }
    public void setPasswordResetTokenExpiry(LocalDateTime passwordResetTokenExpiry) { this.passwordResetTokenExpiry = passwordResetTokenExpiry; }
    
    public String getTwoFactorSecret() { return twoFactorSecret; }
    public void setTwoFactorSecret(String twoFactorSecret) { this.twoFactorSecret = twoFactorSecret; }
    
    public boolean isTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }
    
    public String getTwoFactorBackupCodes() { return twoFactorBackupCodes; }
    public void setTwoFactorBackupCodes(String twoFactorBackupCodes) { this.twoFactorBackupCodes = twoFactorBackupCodes; }
    
    public boolean isAccountLocked() { return accountLocked; }
    public void setAccountLocked(boolean accountLocked) { this.accountLocked = accountLocked; }
    
    public int getFailedLoginAttempts() { return failedLoginAttempts; }
    public void setFailedLoginAttempts(int failedLoginAttempts) { this.failedLoginAttempts = failedLoginAttempts; }
    
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
    
    public UserSettings getUserSettings() { return userSettings; }
    public void setUserSettings(UserSettings userSettings) { this.userSettings = userSettings; }
    
    // Password verification method for security
    public boolean verifyPassword(String candidatePassword, org.springframework.security.crypto.password.PasswordEncoder encoder) {
        return encoder.matches(candidatePassword, this.password);
    }
}