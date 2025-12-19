package om.community.supportsystem.controller;

import om.community.supportsystem.model.Request;
import om.community.supportsystem.model.RequestStatus;
import om.community.supportsystem.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@Tag(name = "📝 Requests", description = "Request management APIs - CRUD operations, status updates, and location-based filtering")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class RequestController {
    
    @Autowired
    private RequestService requestService;
    
    // Create
    @Operation(summary = "Create new request", description = "Create a new help request by a citizen")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Request created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    @PostMapping
    public ResponseEntity<Request> createRequest(@RequestBody Request request) {
        Request createdRequest = requestService.createRequest(request);
        return ResponseEntity.ok(createdRequest);
    }
    
    // Read
    @Operation(summary = "Get all requests", description = "Retrieve all help requests in the system")
    @ApiResponse(responseCode = "200", description = "Requests retrieved successfully")
    @GetMapping
    public ResponseEntity<?> getAllRequests() {
        try {
            List<Request> requests = requestService.getAllRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            System.err.println("Error fetching all requests: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                java.util.Map.of("error", "Failed to fetch requests: " + e.getMessage())
            );
        }
    }
    
    @Operation(summary = "Get request by ID", description = "Retrieve a specific request by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Request found"),
        @ApiResponse(responseCode = "404", description = "Request not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Request> getRequestById(
            @Parameter(description = "Request ID", required = true) @PathVariable Long id) {
        return requestService.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Request>> getRequestsByStatus(@PathVariable RequestStatus status) {
        List<Request> requests = requestService.getRequestsByStatus(status);
        return ResponseEntity.ok(requests);
    }
    
    @Operation(summary = "Get requests by citizen", description = "Retrieve all requests created by a specific citizen")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Requests retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/citizen/{citizenId}")
    public ResponseEntity<?> getRequestsByCitizenId(
            @Parameter(description = "Citizen user ID", required = true) @PathVariable Long citizenId) {
        try {
            List<Request> requests = requestService.getRequestsByCitizenId(citizenId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            System.err.println("Error fetching requests for citizen " + citizenId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                java.util.Map.of("error", "Failed to fetch requests: " + e.getMessage())
            );
        }
    }
    
    @Operation(summary = "Get pending requests", description = "Retrieve all requests with PENDING status for volunteers to accept")
    @ApiResponse(responseCode = "200", description = "Pending requests retrieved successfully")
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingRequests() {
        try {
            List<Request> requests = requestService.getPendingRequests();
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            System.err.println("Error fetching pending requests: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                java.util.Map.of("error", "Failed to fetch pending requests: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/province/{province}")
    public ResponseEntity<?> getRequestsByProvince(@PathVariable String province) {
        try {
            List<Request> requests = requestService.getRequestsByProvince(province);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            System.err.println("Error fetching requests for province " + province + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                java.util.Map.of("error", "Failed to fetch requests for province: " + e.getMessage())
            );
        }
    }
    
    @Operation(summary = "Get pending requests by province", description = "Retrieve pending requests from a specific province for location-based filtering")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pending requests retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/pending/province/{province}")
    public ResponseEntity<?> getPendingRequestsByProvince(
            @Parameter(description = "Province name (e.g., 'Kigali City', 'Eastern Province')", required = true) 
            @PathVariable String province) {
        try {
            List<Request> requests = requestService.getPendingRequestsByProvince(province);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            System.err.println("Error fetching pending requests for province " + province + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                java.util.Map.of("error", "Failed to fetch pending requests for province: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<Request>> getRecentRequests() {
        List<Request> requests = requestService.getRecentRequests();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<Request>> getRequestsByStatusAndProvince(
            @RequestParam RequestStatus status,
            @RequestParam String province,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        Page<Request> requests = requestService.getRequestsByStatusAndProvince(status, province, pageable);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/search/title/{title}")
    public ResponseEntity<List<Request>> searchRequestsByTitle(@PathVariable String title) {
        List<Request> requests = requestService.searchRequestsByTitle(title);
        return ResponseEntity.ok(requests);
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Request> updateRequest(@PathVariable Long id, @RequestBody Request requestDetails) {
        try {
            Request updatedRequest = requestService.updateRequest(id, requestDetails);
            return ResponseEntity.ok(updatedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Request> updateRequestStatus(@PathVariable Long id, @RequestParam RequestStatus status) {
        try {
            Request updatedRequest = requestService.updateRequestStatus(id, status);
            return ResponseEntity.ok(updatedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
    
    // Statistics endpoints
    @GetMapping("/count/pending")
    public ResponseEntity<Long> getTotalPendingRequests() {
        long count = requestService.getTotalPendingRequests();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/count/completed")
    public ResponseEntity<Long> getTotalCompletedRequests() {
        long count = requestService.getTotalCompletedRequests();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countRequestsByStatus(@PathVariable RequestStatus status) {
        long count = requestService.countRequestsByStatus(status);
        return ResponseEntity.ok(count);
    }
}