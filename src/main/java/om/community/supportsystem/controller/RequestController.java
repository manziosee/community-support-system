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

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {
    
    @Autowired
    private RequestService requestService;
    
    // Create
    @PostMapping
    public ResponseEntity<Request> createRequest(@RequestBody Request request) {
        Request createdRequest = requestService.createRequest(request);
        return ResponseEntity.ok(createdRequest);
    }
    
    // Read
    @GetMapping
    public ResponseEntity<List<Request>> getAllRequests() {
        List<Request> requests = requestService.getAllRequests();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Request> getRequestById(@PathVariable Long id) {
        return requestService.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Request>> getRequestsByStatus(@PathVariable RequestStatus status) {
        List<Request> requests = requestService.getRequestsByStatus(status);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/citizen/{citizenId}")
    public ResponseEntity<List<Request>> getRequestsByCitizenId(@PathVariable Long citizenId) {
        List<Request> requests = requestService.getRequestsByCitizenId(citizenId);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<Request>> getPendingRequests() {
        List<Request> requests = requestService.getPendingRequests();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/province/{province}")
    public ResponseEntity<List<Request>> getRequestsByProvince(@PathVariable String province) {
        List<Request> requests = requestService.getRequestsByProvince(province);
        return ResponseEntity.ok(requests);
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