package om.community.supportsystem.dto;

import om.community.supportsystem.model.User;
import om.community.supportsystem.model.UserRole;
import java.time.LocalDateTime;
import java.util.Set;

public class UserResponseDTO {
    private Long userId;
    private String name;
    private String email;
    private String phoneNumber;
    private UserRole role;
    private LocalDateTime createdAt;
    private boolean emailVerified;
    private boolean twoFactorEnabled;
    private boolean accountLocked;
    private int failedLoginAttempts;
    private LocalDateTime lastLoginAt;
    
    // Safe location data
    private String province;
    private String district;
    private String sector;
    private String cell;
    private String village;
    
    // Location object for backward compatibility
    private LocationInfo location;
    
    // Skills count
    private int skillCount;
    
    public UserResponseDTO(User user) {
        this.userId = user.getUserId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.role = user.getRole();
        this.createdAt = user.getCreatedAt();
        this.emailVerified = user.isEmailVerified();
        this.twoFactorEnabled = user.isTwoFactorEnabled();
        this.accountLocked = user.isAccountLocked();
        this.failedLoginAttempts = user.getFailedLoginAttempts();
        this.lastLoginAt = user.getLastLoginAt();
        
        // Handle location data safely
        if (user.getLocation() != null) {
            this.province = user.getLocation().getProvince();
            this.district = user.getLocation().getDistrict();
            this.location = new LocationInfo(user.getLocation().getProvince(), user.getLocation().getDistrict());
        } else {
            // Use individual location fields as fallback
            this.province = user.getProvince();
            this.district = user.getDistrict();
            this.location = new LocationInfo(user.getProvince(), user.getDistrict());
        }
        
        // Use individual location fields for detailed info
        this.sector = user.getSector();
        this.cell = user.getCell();
        this.village = user.getVillage();
        
        // Skills count
        this.skillCount = user.getSkills() != null ? user.getSkills().size() : 0;
    }
    
    // Inner class for location info
    public static class LocationInfo {
        private String province;
        private String district;
        
        public LocationInfo(String province, String district) {
            this.province = province != null ? province : "Not specified";
            this.district = district != null ? district : "Not specified";
        }
        
        public String getProvince() { return province; }
        public void setProvince(String province) { this.province = province; }
        
        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }
    }
    
    // Getters and setters
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
    
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    
    public boolean isTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }
    
    public boolean isAccountLocked() { return accountLocked; }
    public void setAccountLocked(boolean accountLocked) { this.accountLocked = accountLocked; }
    
    public int getFailedLoginAttempts() { return failedLoginAttempts; }
    public void setFailedLoginAttempts(int failedLoginAttempts) { this.failedLoginAttempts = failedLoginAttempts; }
    
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
    
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
    
    public LocationInfo getLocation() { return location; }
    public void setLocation(LocationInfo location) { this.location = location; }
    
    public int getSkillCount() { return skillCount; }
    public void setSkillCount(int skillCount) { this.skillCount = skillCount; }
}