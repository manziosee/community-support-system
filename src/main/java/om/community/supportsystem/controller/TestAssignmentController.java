package om.community.supportsystem.controller;

import om.community.supportsystem.model.Assignment;
import om.community.supportsystem.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test-assignments")
@Tag(name = "🧪 Test Assignments", description = "Testing endpoints for debugging assignment functionality")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class TestAssignmentController {
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Operation(summary = "Get assignment count", description = "Get total assignment count for debugging")
    @ApiResponse(responseCode = "200", description = "Assignment count retrieved successfully")
    @GetMapping("/count")
    public ResponseEntity<?> getAssignmentCount() {
        try {
            long totalCount = assignmentRepository.count();
            
            return ResponseEntity.ok(Map.of(
                "totalAssignments", totalCount,
                "message", "Assignment count retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to get assignment count: " + e.getMessage()
            ));
        }
    }
    
    @Operation(summary = "Get simple assignments by volunteer", description = "Get assignments for volunteer without complex relationships")
    @ApiResponse(responseCode = "200", description = "Simple assignments retrieved successfully")
    @GetMapping("/volunteer/{volunteerId}/simple")
    public ResponseEntity<?> getSimpleAssignmentsByVolunteer(@PathVariable Long volunteerId) {
        try {
            System.out.println("🔍 Testing simple assignment retrieval for volunteer: " + volunteerId);
            
            List<Assignment> assignments = assignmentRepository.findByVolunteerUserId(volunteerId);
            
            // Create simplified response to avoid serialization issues
            List<Map<String, Object>> simpleAssignments = assignments.stream()
                .map(assignment -> Map.of(
                    "assignmentId", (Object) assignment.getAssignmentId(),
                    "acceptedAt", (Object) assignment.getAcceptedAt().toString(),
                    "completedAt", (Object) (assignment.getCompletedAt() != null ? assignment.getCompletedAt().toString() : null),
                    "requestId", (Object) (assignment.getRequest() != null ? assignment.getRequest().getRequestId() : null),
                    "volunteerId", (Object) (assignment.getVolunteer() != null ? assignment.getVolunteer().getUserId() : null)
                ))
                .toList();
            
            return ResponseEntity.ok(Map.of(
                "assignments", simpleAssignments,
                "count", simpleAssignments.size(),
                "volunteerId", volunteerId
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to get simple assignments: " + e.getMessage(),
                "volunteerId", volunteerId
            ));
        }
    }
    
    @Operation(summary = "Get all assignments", description = "Get all assignments for debugging")
    @ApiResponse(responseCode = "200", description = "All assignments retrieved successfully")
    @GetMapping("/all")
    public ResponseEntity<?> getAllAssignments() {
        try {
            List<Assignment> assignments = assignmentRepository.findAll();
            
            List<Map<String, Object>> simpleAssignments = assignments.stream()
                .map(assignment -> Map.of(
                    "assignmentId", (Object) assignment.getAssignmentId(),
                    "acceptedAt", (Object) assignment.getAcceptedAt().toString(),
                    "completedAt", (Object) (assignment.getCompletedAt() != null ? assignment.getCompletedAt().toString() : null),
                    "requestId", (Object) (assignment.getRequest() != null ? assignment.getRequest().getRequestId() : null),
                    "volunteerId", (Object) (assignment.getVolunteer() != null ? assignment.getVolunteer().getUserId() : null)
                ))
                .toList();
            
            return ResponseEntity.ok(Map.of(
                "assignments", simpleAssignments,
                "count", simpleAssignments.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to get all assignments: " + e.getMessage()
            ));
        }
    }
}