package om.community.supportsystem.controller;

import om.community.supportsystem.model.Location;
import om.community.supportsystem.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class LocationController {
    
    @Autowired
    private LocationService locationService;
    
    // Create
    @PostMapping
    public ResponseEntity<Location> createLocation(@RequestBody Location location) {
        Location createdLocation = locationService.createLocation(location);
        return ResponseEntity.ok(createdLocation);
    }
    
    // Read
    @GetMapping
    public ResponseEntity<List<Location>> getAllLocations() {
        List<Location> locations = locationService.getAllLocations();
        return ResponseEntity.ok(locations);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable Long id) {
        return locationService.getLocationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/province-code/{provinceCode}")
    public ResponseEntity<List<Location>> getLocationsByProvinceCode(@PathVariable String provinceCode) {
        List<Location> locations = locationService.getLocationsByProvinceCode(provinceCode);
        return ResponseEntity.ok(locations);
    }
    
    @GetMapping("/province/{province}")
    public ResponseEntity<List<Location>> getLocationsByProvince(@PathVariable String province) {
        List<Location> locations = locationService.getLocationsByProvince(province);
        return ResponseEntity.ok(locations);
    }
    
    @GetMapping("/provinces")
    public ResponseEntity<List<String>> getAllProvinces() {
        List<String> provinces = locationService.getAllProvinces();
        return ResponseEntity.ok(provinces);
    }
    
    @GetMapping("/districts/{province}")
    public ResponseEntity<List<Location>> getDistrictsByProvince(@PathVariable String province) {
        List<Location> locations = locationService.getLocationsByProvince(province);
        return ResponseEntity.ok(locations);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<Location>> searchLocationsByProvince(
            @RequestParam String province,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "province") String sortBy) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Location> locations = locationService.getLocationsByProvinceWithPagination(province, pageable);
        return ResponseEntity.ok(locations);
    }
    
    @GetMapping("/popular")
    public ResponseEntity<List<Location>> getLocationsOrderByUserCount() {
        List<Location> locations = locationService.getLocationsOrderByUserCount();
        return ResponseEntity.ok(locations);
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(@PathVariable Long id, @RequestBody Location locationDetails) {
        try {
            Location updatedLocation = locationService.updateLocation(id, locationDetails);
            return ResponseEntity.ok(updatedLocation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }
    
    // Utility endpoints
    @GetMapping("/exists/province-code/{provinceCode}")
    public ResponseEntity<Boolean> existsByProvinceCode(@PathVariable String provinceCode) {
        boolean exists = locationService.existsByProvinceCode(provinceCode);
        return ResponseEntity.ok(exists);
    }
}