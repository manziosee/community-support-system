package om.community.supportsystem.service;

import om.community.supportsystem.model.Request;
import om.community.supportsystem.model.RequestStatus;
import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RequestService {
    
    @Autowired
    private RequestRepository requestRepository;
    
    // Create
    public Request createRequest(Request request) {
        return requestRepository.save(request);
    }
    
    // Read
    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }
    
    public Optional<Request> getRequestById(Long id) {
        return requestRepository.findById(id);
    }
    
    public List<Request> getRequestsByStatus(RequestStatus status) {
        return requestRepository.findByStatus(status);
    }
    
    public List<Request> getRequestsByCitizen(User citizen) {
        return requestRepository.findByCitizen(citizen);
    }
    
    public List<Request> getRequestsByCitizenId(Long citizenId) {
        return requestRepository.findByCitizenUserId(citizenId);
    }
    
    public List<Request> getPendingRequests() {
        return requestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.PENDING);
    }
    
    public List<Request> getRequestsByProvince(String province) {
        return requestRepository.findByLocationProvince(province);
    }
    
    public List<Request> getRequestsCreatedAfter(LocalDateTime date) {
        return requestRepository.findByCreatedAtAfter(date);
    }
    
    public List<Request> getRecentRequests() {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        return requestRepository.findRecentRequests(weekAgo);
    }
    
    public Page<Request> getRequestsByStatusAndProvince(RequestStatus status, String province, Pageable pageable) {
        return requestRepository.findByStatusAndCitizen_Location_Province(status, province, pageable);
    }
    
    public List<Request> searchRequestsByTitle(String title) {
        return requestRepository.findByTitleContainingIgnoreCase(title);
    }
    
    // Update
    public Request updateRequest(Long id, Request requestDetails) {
        return requestRepository.findById(id)
                .map(request -> {
                    request.setTitle(requestDetails.getTitle());
                    request.setDescription(requestDetails.getDescription());
                    request.setStatus(requestDetails.getStatus());
                    return requestRepository.save(request);
                })
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
    }
    
    public Request updateRequestStatus(Long id, RequestStatus status) {
        return requestRepository.findById(id)
                .map(request -> {
                    request.setStatus(status);
                    return requestRepository.save(request);
                })
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
    }
    
    // Delete
    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }
    
    // Utility methods
    public boolean existsByTitleAndCitizen(String title, User citizen) {
        return requestRepository.existsByTitleAndCitizen(title, citizen);
    }
    
    public long countRequestsByStatus(RequestStatus status) {
        return requestRepository.countByStatus(status);
    }
    
    public long getTotalPendingRequests() {
        return requestRepository.countByStatus(RequestStatus.PENDING);
    }
    
    public long getTotalCompletedRequests() {
        return requestRepository.countByStatus(RequestStatus.COMPLETED);
    }
}