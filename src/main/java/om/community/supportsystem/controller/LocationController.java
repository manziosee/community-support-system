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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@Tag(name = "🏛️ Location Management", description = "APIs for managing Rwandan administrative locations (Provinces, Districts, Sectors, Cells, Villages)")
public class LocationController {
    
    @Autowired
    private LocationService locationService;
    
    // Create
    @Operation(summary = "Create a new location", description = "Add a new administrative location to the system")
    @ApiResponse(responseCode = "200", description = "Location created successfully")
    @PostMapping
    public ResponseEntity<Location> createLocation(
            @Parameter(description = "Location data", required = true)
            @RequestBody Location location) {
        Location createdLocation = locationService.createLocation(location);
        return ResponseEntity.ok(createdLocation);
    }
    
    // Read
    @Operation(summary = "Get all locations", description = "Retrieve all 30 Rwandan administrative locations (5 provinces, 30 districts)")
    @ApiResponse(responseCode = "200", description = "List of all locations retrieved successfully")
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
    public ResponseEntity<List<String>> getDistrictsByProvince(@PathVariable String province) {
        List<String> districts = locationService.getDistrictsByProvince(province);
        return ResponseEntity.ok(districts);
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