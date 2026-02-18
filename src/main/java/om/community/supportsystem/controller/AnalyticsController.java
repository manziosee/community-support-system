package om.community.supportsystem.controller;

import om.community.supportsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
@Tag(name = "📊 Analytics", description = "Dashboard statistics and business intelligence endpoints")
public class AnalyticsController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RequestRepository requestRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private SkillRepository skillRepository;

    @Operation(summary = "Get Dashboard Statistics", description = "Get comprehensive dashboard statistics including users, requests, assignments, and completion rates")
    @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalVolunteers = userRepository.countByRole("VOLUNTEER");
        long totalCitizens = userRepository.countByRole("CITIZEN");
        long totalRequests = requestRepository.count();
        long pendingRequests = requestRepository.countByStatus("PENDING");
        long completedRequests = requestRepository.countByStatus("COMPLETED");
        long totalAssignments = assignmentRepository.count();
        
        double completionRate = totalRequests > 0 ? 
            (completedRequests * 100.0 / totalRequests) : 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalVolunteers", totalVolunteers);
        stats.put("totalCitizens", totalCitizens);
        stats.put("totalRequests", totalRequests);
        stats.put("pendingRequests", pendingRequests);
        stats.put("completedRequests", completedRequests);
        stats.put("totalAssignments", totalAssignments);
        stats.put("completionRate", Math.round(completionRate * 10) / 10.0);
        stats.put("activeVolunteers", totalVolunteers);
        
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "Get Province Statistics", description = "Get statistics for all provinces including user count, request count, and completion rates")
    @ApiResponse(responseCode = "200", description = "Province statistics retrieved successfully")
    @GetMapping("/provinces")
    public ResponseEntity<?> getProvinceStats() {
        List<String> provinces = Arrays.asList(
            "Kigali", "East", "South", "West", "North"
        );
        
        List<Map<String, Object>> provinceStats = provinces.stream()
            .map(province -> {
                long userCount = userRepository.countByProvince(province);
                long requestCount = requestRepository.countByProvince(province);
                long completedCount = requestRepository.countByProvinceAndStatus(province, "COMPLETED");
                
                double completion = requestCount > 0 ? 
                    (completedCount * 100.0 / requestCount) : 0;
                
                Map<String, Object> stat = new HashMap<>();
                stat.put("province", province);
                stat.put("users", userCount);
                stat.put("requests", requestCount);
                stat.put("completionRate", Math.round(completion * 10) / 10.0);
                return stat;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(provinceStats);
    }

    @Operation(summary = "Get Popular Skills", description = "Get list of skills ordered by number of users who have them")
    @ApiResponse(responseCode = "200", description = "Popular skills retrieved successfully")
    @GetMapping("/skills/popular")
    public ResponseEntity<?> getPopularSkills() {
        return ResponseEntity.ok(skillRepository.findSkillsOrderByUserCount());
    }

    @Operation(summary = "Get Citizen Dashboard Stats", description = "Get dashboard statistics for a specific citizen")
    @ApiResponse(responseCode = "200", description = "Citizen stats retrieved successfully")
    @GetMapping("/citizen/{userId}")
    public ResponseEntity<?> getCitizenStats(@PathVariable Long userId) {
        try {
            long totalRequests = requestRepository.countByCitizenUserId(userId);
            long pendingRequests = requestRepository.countByCitizenUserIdAndStatus(userId, om.community.supportsystem.model.RequestStatus.PENDING);
            long acceptedRequests = requestRepository.countByCitizenUserIdAndStatus(userId, om.community.supportsystem.model.RequestStatus.ACCEPTED);
            long completedRequests = requestRepository.countByCitizenUserIdAndStatus(userId, om.community.supportsystem.model.RequestStatus.COMPLETED);
            long cancelledRequests = requestRepository.countByCitizenUserIdAndStatus(userId, om.community.supportsystem.model.RequestStatus.CANCELLED);
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalRequests", totalRequests);
            stats.put("pendingRequests", pendingRequests);
            stats.put("acceptedRequests", acceptedRequests);
            stats.put("completedRequests", completedRequests);
            stats.put("cancelledRequests", cancelledRequests);
            
            // Request status breakdown for chart
            List<Map<String, Object>> statusBreakdown = new ArrayList<>();
            if (pendingRequests > 0) {
                Map<String, Object> pending = new HashMap<>();
                pending.put("status", "Pending");
                pending.put("count", pendingRequests);
                statusBreakdown.add(pending);
            }
            if (acceptedRequests > 0) {
                Map<String, Object> accepted = new HashMap<>();
                accepted.put("status", "Accepted");
                accepted.put("count", acceptedRequests);
                statusBreakdown.add(accepted);
            }
            if (completedRequests > 0) {
                Map<String, Object> completed = new HashMap<>();
                completed.put("status", "Completed");
                completed.put("count", completedRequests);
                statusBreakdown.add(completed);
            }
            if (cancelledRequests > 0) {
                Map<String, Object> cancelled = new HashMap<>();
                cancelled.put("status", "Cancelled");
                cancelled.put("count", cancelledRequests);
                statusBreakdown.add(cancelled);
            }
            stats.put("statusBreakdown", statusBreakdown);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("❌ Error getting citizen stats for userId " + userId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to fetch citizen statistics",
                "message", e.getMessage()
            ));
        }
    }

    @Operation(summary = "Get Volunteer Dashboard Stats", description = "Get dashboard statistics for a specific volunteer")
    @ApiResponse(responseCode = "200", description = "Volunteer stats retrieved successfully")
    @GetMapping("/volunteer/{userId}")
    public ResponseEntity<?> getVolunteerStats(@PathVariable Long userId) {
        try {
            long totalAssignments = assignmentRepository.countByVolunteerUserId(userId);
            long activeAssignments = assignmentRepository.countByVolunteerUserIdAndCompletedAtIsNull(userId);
            long completedAssignments = assignmentRepository.countByVolunteerUserIdAndCompletedAtIsNotNull(userId);
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalAssignments", totalAssignments);
            stats.put("activeAssignments", activeAssignments);
            stats.put("completedAssignments", completedAssignments);
            
            // Assignment status breakdown for chart
            List<Map<String, Object>> statusBreakdown = new ArrayList<>();
            if (activeAssignments > 0) {
                Map<String, Object> active = new HashMap<>();
                active.put("status", "Active");
                active.put("count", activeAssignments);
                statusBreakdown.add(active);
            }
            if (completedAssignments > 0) {
                Map<String, Object> completed = new HashMap<>();
                completed.put("status", "Completed");
                completed.put("count", completedAssignments);
                statusBreakdown.add(completed);
            }
            stats.put("statusBreakdown", statusBreakdown);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("❌ Error getting volunteer stats for userId " + userId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to fetch volunteer statistics",
                "message", e.getMessage()
            ));
        }
    }
}
