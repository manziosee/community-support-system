package om.community.supportsystem.dto;

import om.community.supportsystem.model.Request;
import om.community.supportsystem.model.RequestCategory;
import om.community.supportsystem.model.RequestStatus;
import java.time.LocalDateTime;

public class RequestResponseDTO {
    private Long requestId;
    private String title;
    private String description;
    private RequestCategory category;
    private RequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Citizen info with safe location handling
    private Long citizenId;
    private String citizenName;
    private String citizenEmail;
    private String citizenPhone;
    private String citizenProvince;
    private String citizenDistrict;
    private String citizenSector;
    private String citizenCell;
    private String citizenVillage;
    
    // Nested citizen object for frontend compatibility
    private CitizenInfo citizen;
    
    public RequestResponseDTO(Request request) {
        this.requestId = request.getRequestId();
        this.title = request.getTitle();
        this.description = request.getDescription();
        this.category = request.getCategory();
        this.status = request.getStatus();
        this.createdAt = request.getCreatedAt();
        this.updatedAt = request.getUpdatedAt();
        
        // Handle citizen info safely
        if (request.getCitizen() != null) {
            this.citizenId = request.getCitizen().getUserId();
            this.citizenName = request.getCitizen().getName();
            this.citizenEmail = request.getCitizen().getEmail();
            this.citizenPhone = request.getCitizen().getPhoneNumber();
            
            // Handle location data safely
            if (request.getCitizen().getLocation() != null) {
                this.citizenProvince = request.getCitizen().getLocation().getProvince();
                this.citizenDistrict = request.getCitizen().getLocation().getDistrict();
            } else {
                // Use individual location fields as fallback
                this.citizenProvince = request.getCitizen().getProvince();
                this.citizenDistrict = request.getCitizen().getDistrict();
            }
            
            this.citizenSector = request.getCitizen().getSector();
            this.citizenCell = request.getCitizen().getCell();
            this.citizenVillage = request.getCitizen().getVillage();
            
            // Create nested citizen object
            this.citizen = new CitizenInfo(
                this.citizenId,
                this.citizenName,
                this.citizenEmail,
                this.citizenPhone,
                this.citizenProvince,
                this.citizenDistrict,
                this.citizenSector,
                this.citizenCell,
                this.citizenVillage
            );
        }
    }
    
    // Nested CitizenInfo class
    public static class CitizenInfo {
        private Long userId;
        private String name;
        private String email;
        private String phoneNumber;
        private String province;
        private String district;
        private String sector;
        private String cell;
        private String village;
        private LocationInfo location;
        
        public CitizenInfo(Long userId, String name, String email, String phoneNumber,
                          String province, String district, String sector, String cell, String village) {
            this.userId = userId;
            this.name = name != null ? name : "Unknown";
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.province = province != null ? province : "Not specified";
            this.district = district != null ? district : "Not specified";
            this.sector = sector;
            this.cell = cell;
            this.village = village;
            
            // Create location object for backward compatibility
            this.location = new LocationInfo(this.province, this.district);
        }
        
        // Getters
        public Long getUserId() { return userId; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getPhoneNumber() { return phoneNumber; }
        public String getProvince() { return province; }
        public String getDistrict() { return district; }
        public String getSector() { return sector; }
        public String getCell() { return cell; }
        public String getVillage() { return village; }
        public LocationInfo getLocation() { return location; }
    }
    
    // LocationInfo class
    public static class LocationInfo {
        private String province;
        private String district;
        
        public LocationInfo(String province, String district) {
            this.province = province != null ? province : "Not specified";
            this.district = district != null ? district : "Not specified";
        }
        
        public String getProvince() { return province; }
        public String getDistrict() { return district; }
    }
    
    // Getters and setters
    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public RequestCategory getCategory() { return category; }
    public void setCategory(RequestCategory category) { this.category = category; }
    
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Long getCitizenId() { return citizenId; }
    public void setCitizenId(Long citizenId) { this.citizenId = citizenId; }
    
    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }
    
    public String getCitizenEmail() { return citizenEmail; }
    public void setCitizenEmail(String citizenEmail) { this.citizenEmail = citizenEmail; }
    
    public String getCitizenPhone() { return citizenPhone; }
    public void setCitizenPhone(String citizenPhone) { this.citizenPhone = citizenPhone; }
    
    public String getCitizenProvince() { return citizenProvince; }
    public void setCitizenProvince(String citizenProvince) { this.citizenProvince = citizenProvince; }
    
    public String getCitizenDistrict() { return citizenDistrict; }
    public void setCitizenDistrict(String citizenDistrict) { this.citizenDistrict = citizenDistrict; }
    
    public String getCitizenSector() { return citizenSector; }
    public void setCitizenSector(String citizenSector) { this.citizenSector = citizenSector; }
    
    public String getCitizenCell() { return citizenCell; }
    public void setCitizenCell(String citizenCell) { this.citizenCell = citizenCell; }
    
    public String getCitizenVillage() { return citizenVillage; }
    public void setCitizenVillage(String citizenVillage) { this.citizenVillage = citizenVillage; }
    
    public CitizenInfo getCitizen() { return citizen; }
    public void setCitizen(CitizenInfo citizen) { this.citizen = citizen; }
}