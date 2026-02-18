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
}
