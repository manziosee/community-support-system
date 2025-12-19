package om.community.supportsystem.controller;

import om.community.supportsystem.model.Request;
import om.community.supportsystem.model.RequestStatus;
import om.community.supportsystem.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test-requests")
@Tag(name = "🧪 Test Requests", description = "Testing endpoints for debugging request functionality")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class TestRequestController {
    
    @Autowired
    private RequestRepository requestRepository;
    
    @Operation(summary = "Get request counts", description = "Get total and pending request counts for debugging")
    @ApiResponse(responseCode = "200", description = "Request counts retrieved successfully")
    @GetMapping("/count")
    public ResponseEntity<?> getRequestCount() {
        try {
            long totalCount = requestRepository.count();
            long pendingCount = requestRepository.countByStatus(RequestStatus.PENDING);
            
            return ResponseEntity.ok(Map.of(
                "totalRequests", (Object) totalCount,
                "pendingRequests", (Object) pendingCount,
                "message", (Object) "Request counts retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to get request count: " + e.getMessage()
            ));
        }
    }
    
    @Operation(summary = "Get simplified requests", description = "Get all requests in simplified format to avoid serialization issues")
    @ApiResponse(responseCode = "200", description = "Simplified requests retrieved successfully")
    @GetMapping("/simple")
    public ResponseEntity<?> getSimpleRequests() {
        try {
            List<Request> requests = requestRepository.findAll();
            
            // Create simplified response to avoid serialization issues
            List<Map<String, Object>> simpleRequests = requests.stream()
                .map(request -> {
                    Map<String, Object> map = Map.of(
                        "requestId", (Object) request.getRequestId(),
                        "title", (Object) request.getTitle(),
                        "status", (Object) request.getStatus().toString(),
                        "createdAt", (Object) request.getCreatedAt().toString(),
                        "citizenName", (Object) (request.getCitizen() != null ? request.getCitizen().getName() : "Unknown")
                    );
                    return map;
                })
                .toList();
            
            return ResponseEntity.ok(Map.of(
                "requests", simpleRequests,
                "count", simpleRequests.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to get requests: " + e.getMessage()
            ));
        }
    }
}