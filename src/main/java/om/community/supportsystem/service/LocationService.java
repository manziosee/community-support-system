package om.community.supportsystem.service;

import om.community.supportsystem.model.Location;
import om.community.supportsystem.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationService {
    
    @Autowired
    private LocationRepository locationRepository;
    
    // Create
    public Location createLocation(Location location) {
        return locationRepository.save(location);
    }
    
    // Read
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }
    
    public Optional<Location> getLocationById(Long id) {
        return locationRepository.findById(id);
    }
    
    public List<Location> getLocationsByProvinceCode(String provinceCode) {
        return locationRepository.findByProvinceCode(provinceCode);
    }
    
    public List<Location> getLocationsByProvince(String province) {
        return locationRepository.findByProvince(province);
    }
    
    public List<String> getAllProvinces() {
        return locationRepository.findAllProvinces();
    }
    
    public List<String> getDistrictsByProvince(String province) {
        return locationRepository.findDistrictsByProvince(province);
    }
    
    public Page<Location> getLocationsByProvinceWithPagination(String province, Pageable pageable) {
        return locationRepository.findByProvinceContainingIgnoreCase(province, pageable);
    }
    
    public List<Location> getLocationsOrderByUserCount() {
        return locationRepository.findLocationsOrderByUserCount();
    }
    
    // Update
    public Location updateLocation(Long id, Location locationDetails) {
        return locationRepository.findById(id)
                .map(location -> {
                    location.setProvince(locationDetails.getProvince());
                    location.setDistrict(locationDetails.getDistrict());
                    location.setSector(locationDetails.getSector());
                    location.setCell(locationDetails.getCell());
                    location.setVillage(locationDetails.getVillage());
                    location.setProvinceCode(locationDetails.getProvinceCode());
                    return locationRepository.save(location);
                })
                .orElseThrow(() -> new RuntimeException("Location not found with id: " + id));
    }
    
    // Delete
    public void deleteLocation(Long id) {
        Location location = locationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Location not found with id: " + id));
        
        if (location.getUsers() != null && !location.getUsers().isEmpty()) {
            throw new RuntimeException("Cannot delete location with existing users. Please reassign users first.");
        }
        
        locationRepository.deleteById(id);
    }
    
    // Utility methods
    public boolean existsByProvinceCode(String provinceCode) {
        return locationRepository.existsByProvinceCode(provinceCode);
    }
}