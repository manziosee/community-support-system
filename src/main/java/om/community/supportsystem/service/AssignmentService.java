package om.community.supportsystem.service;

import om.community.supportsystem.model.Assignment;
import om.community.supportsystem.model.Request;
import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private RequestService requestService;
    
    // Create
    public Assignment createAssignment(Assignment assignment) {
        // Check if request is already assigned
        if (assignmentRepository.existsByRequestAndVolunteer(assignment.getRequest(), assignment.getVolunteer())) {
            throw new RuntimeException("Assignment already exists for this request and volunteer");
        }
        
        // Update request status to ACCEPTED
        requestService.updateRequestStatus(assignment.getRequest().getRequestId(), Request.Status.ACCEPTED);
        
        return assignmentRepository.save(assignment);
    }
    
    // Read
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }
    
    public Optional<Assignment> getAssignmentById(Long id) {
        return assignmentRepository.findById(id);
    }
    
    public List<Assignment> getAssignmentsByVolunteer(User volunteer) {
        return assignmentRepository.findByVolunteer(volunteer);
    }
    
    public List<Assignment> getAssignmentsByRequest(Request request) {
        return assignmentRepository.findByRequest(request);
    }
    
    public List<Assignment> getAssignmentsByVolunteerId(Long volunteerId) {
        return assignmentRepository.findByVolunteerUserId(volunteerId);
    }
    
    public List<Assignment> getCompletedAssignments() {
        return assignmentRepository.findByCompletedAtIsNotNull();
    }
    
    public List<Assignment> getPendingAssignments() {
        return assignmentRepository.findByCompletedAtIsNull();
    }
    
    public Optional<Assignment> getCurrentAssignmentForRequest(Request request) {
        return assignmentRepository.findByRequestAndCompletedAtIsNull(request);
    }
    
    public List<Assignment> getAssignmentsByProvince(String province) {
        return assignmentRepository.findByVolunteerLocationProvince(province);
    }
    
    public Page<Assignment> getAssignmentsByVolunteer(User volunteer, Pageable pageable) {
        return assignmentRepository.findByVolunteerOrderByAcceptedAtDesc(volunteer, pageable);
    }
    
    public List<Object[]> getTopVolunteersByAssignmentCount() {
        return assignmentRepository.findTopVolunteersByAssignmentCount();
    }
    
    // Update
    public Assignment updateAssignment(Long id, Assignment assignmentDetails) {
        return assignmentRepository.findById(id)
                .map(assignment -> {
                    assignment.setCompletedAt(assignmentDetails.getCompletedAt());
                    return assignmentRepository.save(assignment);
                })
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + id));
    }
    
    public Assignment completeAssignment(Long id) {
        return assignmentRepository.findById(id)
                .map(assignment -> {
                    assignment.setCompletedAt(LocalDateTime.now());
                    // Update request status to COMPLETED
                    requestService.updateRequestStatus(assignment.getRequest().getRequestId(), Request.Status.COMPLETED);
                    return assignmentRepository.save(assignment);
                })
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + id));
    }
    
    // Delete
    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }
    
    // Utility methods
    public boolean existsByRequestAndVolunteer(Request request, User volunteer) {
        return assignmentRepository.existsByRequestAndVolunteer(request, volunteer);
    }
    
    public long countAssignmentsByVolunteer(User volunteer) {
        return assignmentRepository.countByVolunteer(volunteer);
    }
    
    public long countCompletedAssignmentsByVolunteer(User volunteer) {
        return assignmentRepository.countByVolunteerAndCompletedAtIsNotNull(volunteer);
    }
}