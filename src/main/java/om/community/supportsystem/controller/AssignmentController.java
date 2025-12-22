package om.community.supportsystem.controller;

import om.community.supportsystem.dto.AssignmentResponseDTO;
import om.community.supportsystem.model.Assignment;
import om.community.supportsystem.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class AssignmentController {
    
    @Autowired
    private AssignmentService assignmentService;
    
    // Create
    @PostMapping
    public ResponseEntity<?> createAssignment(@RequestBody Assignment assignment) {
        try {
            System.out.println("🔄 Creating assignment for request: " + 
                (assignment.getRequest() != null ? assignment.getRequest().getRequestId() : "null") + 
                ", volunteer: " + 
                (assignment.getVolunteer() != null ? assignment.getVolunteer().getUserId() : "null"));
            
            Assignment createdAssignment = assignmentService.createAssignment(assignment);
            System.out.println("✅ Assignment created successfully with ID: " + createdAssignment.getAssignmentId());
            return ResponseEntity.ok(createdAssignment);
        } catch (RuntimeException e) {
            System.err.println("❌ Failed to create assignment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }
    
    // Read
    @GetMapping
    public ResponseEntity<List<AssignmentResponseDTO>> getAllAssignments() {
        List<Assignment> assignments = assignmentService.getAllAssignments();
        List<AssignmentResponseDTO> assignmentDTOs = assignments.stream()
            .map(AssignmentResponseDTO::new)
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(assignmentDTOs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getAssignmentById(@PathVariable Long id) {
        try {
            System.out.println("🔍 Fetching assignment by ID: " + id);
            Optional<Assignment> assignmentOpt = assignmentService.getAssignmentById(id);
            
            if (assignmentOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Assignment assignment = assignmentOpt.get();
            
            // Create simplified response to match the structure expected by frontend
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("assignmentId", assignment.getAssignmentId());
            map.put("acceptedAt", assignment.getAcceptedAt());
            map.put("completedAt", assignment.getCompletedAt());
            
            // Simplified request info
            if (assignment.getRequest() != null) {
                java.util.Map<String, Object> requestMap = new java.util.HashMap<>();
                requestMap.put("requestId", assignment.getRequest().getRequestId());
                requestMap.put("title", assignment.getRequest().getTitle());
                requestMap.put("description", assignment.getRequest().getDescription());
                requestMap.put("status", assignment.getRequest().getStatus());
                requestMap.put("createdAt", assignment.getRequest().getCreatedAt());
                
                // Add citizen info to request
                if (assignment.getRequest().getCitizen() != null) {
                    java.util.Map<String, Object> citizenMap = new java.util.HashMap<>();
                    citizenMap.put("userId", assignment.getRequest().getCitizen().getUserId());
                    citizenMap.put("name", assignment.getRequest().getCitizen().getName());
                    citizenMap.put("email", assignment.getRequest().getCitizen().getEmail());
                    citizenMap.put("phoneNumber", assignment.getRequest().getCitizen().getPhoneNumber());
                    citizenMap.put("province", assignment.getRequest().getCitizen().getProvince());
                    citizenMap.put("district", assignment.getRequest().getCitizen().getDistrict());
                    citizenMap.put("sector", assignment.getRequest().getCitizen().getSector());
                    citizenMap.put("cell", assignment.getRequest().getCitizen().getCell());
                    citizenMap.put("village", assignment.getRequest().getCitizen().getVillage());
                    
                    // Add location object for backward compatibility
                    if (assignment.getRequest().getCitizen().getLocation() != null) {
                        java.util.Map<String, Object> locationMap = new java.util.HashMap<>();
                        locationMap.put("province", assignment.getRequest().getCitizen().getLocation().getProvince());
                        locationMap.put("district", assignment.getRequest().getCitizen().getLocation().getDistrict());
                        citizenMap.put("location", locationMap);
                    } else {
                        // Fallback location object
                        java.util.Map<String, Object> locationMap = new java.util.HashMap<>();
                        locationMap.put("province", assignment.getRequest().getCitizen().getProvince());
                        locationMap.put("district", assignment.getRequest().getCitizen().getDistrict());
                        citizenMap.put("location", locationMap);
                    }
                    
                    requestMap.put("citizen", citizenMap);
                }
                
                map.put("request", requestMap);
            }
            
            // Simplified volunteer info
            if (assignment.getVolunteer() != null) {
                java.util.Map<String, Object> volunteerMap = new java.util.HashMap<>();
                volunteerMap.put("userId", assignment.getVolunteer().getUserId());
                volunteerMap.put("name", assignment.getVolunteer().getName());
                map.put("volunteer", volunteerMap);
            }
            
            System.out.println("✅ Assignment " + id + " retrieved successfully");
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            System.err.println("❌ Failed to fetch assignment " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(java.util.Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<?> getAssignmentsByVolunteerId(@PathVariable Long volunteerId) {
        try {
            System.out.println("🔍 Fetching assignments for volunteer ID: " + volunteerId);
            List<Assignment> assignments = assignmentService.getAssignmentsByVolunteerId(volunteerId);
            System.out.println("✅ Found " + assignments.size() + " assignments for volunteer " + volunteerId);
            
            // Create simplified response to avoid serialization issues
            List<java.util.Map<String, Object>> simpleAssignments = assignments.stream()
                .map(assignment -> {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("assignmentId", assignment.getAssignmentId());
                    map.put("acceptedAt", assignment.getAcceptedAt());
                    map.put("completedAt", assignment.getCompletedAt());
                    
                    // Simplified request info
                    if (assignment.getRequest() != null) {
                        java.util.Map<String, Object> requestMap = new java.util.HashMap<>();
                        requestMap.put("requestId", assignment.getRequest().getRequestId());
                        requestMap.put("title", assignment.getRequest().getTitle());
                        requestMap.put("description", assignment.getRequest().getDescription());
                        requestMap.put("status", assignment.getRequest().getStatus());
                        requestMap.put("createdAt", assignment.getRequest().getCreatedAt());
                        
                        // Add citizen info to request
                        if (assignment.getRequest().getCitizen() != null) {
                            java.util.Map<String, Object> citizenMap = new java.util.HashMap<>();
                            citizenMap.put("userId", assignment.getRequest().getCitizen().getUserId());
                            citizenMap.put("name", assignment.getRequest().getCitizen().getName());
                            citizenMap.put("email", assignment.getRequest().getCitizen().getEmail());
                            citizenMap.put("phoneNumber", assignment.getRequest().getCitizen().getPhoneNumber());
                            citizenMap.put("province", assignment.getRequest().getCitizen().getProvince());
                            citizenMap.put("district", assignment.getRequest().getCitizen().getDistrict());
                            citizenMap.put("sector", assignment.getRequest().getCitizen().getSector());
                            citizenMap.put("cell", assignment.getRequest().getCitizen().getCell());
                            citizenMap.put("village", assignment.getRequest().getCitizen().getVillage());
                            
                            // Add location object for backward compatibility
                            if (assignment.getRequest().getCitizen().getLocation() != null) {
                                java.util.Map<String, Object> locationMap = new java.util.HashMap<>();
                                locationMap.put("province", assignment.getRequest().getCitizen().getLocation().getProvince());
                                locationMap.put("district", assignment.getRequest().getCitizen().getLocation().getDistrict());
                                citizenMap.put("location", locationMap);
                            } else {
                                // Fallback location object
                                java.util.Map<String, Object> locationMap = new java.util.HashMap<>();
                                locationMap.put("province", assignment.getRequest().getCitizen().getProvince());
                                locationMap.put("district", assignment.getRequest().getCitizen().getDistrict());
                                citizenMap.put("location", locationMap);
                            }
                            
                            requestMap.put("citizen", citizenMap);
                        }
                        
                        map.put("request", requestMap);
                    }
                    
                    // Simplified volunteer info
                    if (assignment.getVolunteer() != null) {
                        java.util.Map<String, Object> volunteerMap = new java.util.HashMap<>();
                        volunteerMap.put("userId", assignment.getVolunteer().getUserId());
                        volunteerMap.put("name", assignment.getVolunteer().getName());
                        map.put("volunteer", volunteerMap);
                    }
                    
                    return map;
                })
                .collect(java.util.stream.Collectors.toList());
            
            return ResponseEntity.ok(simpleAssignments);
        } catch (Exception e) {
            System.err.println("❌ Failed to fetch assignments for volunteer " + volunteerId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(java.util.Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/completed")
    public ResponseEntity<List<Assignment>> getCompletedAssignments() {
        List<Assignment> assignments = assignmentService.getCompletedAssignments();
        return ResponseEntity.ok(assignments);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<Assignment>> getPendingAssignments() {
        List<Assignment> assignments = assignmentService.getPendingAssignments();
        return ResponseEntity.ok(assignments);
    }
    
    @GetMapping("/province/{province}")
    public ResponseEntity<List<Assignment>> getAssignmentsByProvince(@PathVariable String province) {
        List<Assignment> assignments = assignmentService.getAssignmentsByProvince(province);
        return ResponseEntity.ok(assignments);
    }
    
    @GetMapping("/volunteer/{volunteerId}/paginated")
    public ResponseEntity<Page<Assignment>> getAssignmentsByVolunteerPaginated(
            @PathVariable Long volunteerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "acceptedAt"));
        List<Assignment> assignments = assignmentService.getAssignmentsByVolunteerId(volunteerId);
        return ResponseEntity.ok(Page.empty());
    }
    
    @GetMapping("/top-volunteers")
    public ResponseEntity<List<Object[]>> getTopVolunteersByAssignmentCount() {
        List<Object[]> topVolunteers = assignmentService.getTopVolunteersByAssignmentCount();
        return ResponseEntity.ok(topVolunteers);
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable Long id, @RequestBody Assignment assignmentDetails) {
        try {
            Assignment updatedAssignment = assignmentService.updateAssignment(id, assignmentDetails);
            return ResponseEntity.ok(updatedAssignment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/{id}/complete")
    public ResponseEntity<Assignment> completeAssignment(@PathVariable Long id) {
        try {
            Assignment completedAssignment = assignmentService.completeAssignment(id);
            return ResponseEntity.ok(completedAssignment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}