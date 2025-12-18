package om.community.supportsystem.controller;

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

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class AssignmentController {
    
    @Autowired
    private AssignmentService assignmentService;
    
    // Create
    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) {
        try {
            Assignment createdAssignment = assignmentService.createAssignment(assignment);
            return ResponseEntity.ok(createdAssignment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Read
    @GetMapping
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        List<Assignment> assignments = assignmentService.getAllAssignments();
        return ResponseEntity.ok(assignments);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable Long id) {
        return assignmentService.getAssignmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<List<Assignment>> getAssignmentsByVolunteerId(@PathVariable Long volunteerId) {
        List<Assignment> assignments = assignmentService.getAssignmentsByVolunteerId(volunteerId);
        return ResponseEntity.ok(assignments);
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