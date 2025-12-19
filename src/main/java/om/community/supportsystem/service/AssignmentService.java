package om.community.supportsystem.service;

import om.community.supportsystem.model.Assignment;
import om.community.supportsystem.model.Request;
import om.community.supportsystem.model.RequestStatus;
import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.AssignmentRepository;
import om.community.supportsystem.repository.RequestRepository;
import om.community.supportsystem.repository.UserRepository;
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
    private RequestRepository requestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Create
    public Assignment createAssignment(Assignment assignment) {
        System.out.println("🔄 Creating assignment...");
        
        // Validate input
        if (assignment.getRequest() == null || assignment.getRequest().getRequestId() == null) {
            throw new RuntimeException("Request is required and must have a valid ID");
        }
        
        if (assignment.getVolunteer() == null || assignment.getVolunteer().getUserId() == null) {
            throw new RuntimeException("Volunteer is required and must have a valid ID");
        }
        
        // Fetch the actual request and volunteer entities
        Request request = requestRepository.findById(assignment.getRequest().getRequestId())
            .orElseThrow(() -> new RuntimeException("Request not found with ID: " + assignment.getRequest().getRequestId()));
        
        User volunteer = userRepository.findById(assignment.getVolunteer().getUserId())
            .orElseThrow(() -> new RuntimeException("Volunteer not found with ID: " + assignment.getVolunteer().getUserId()));
        
        // Check if request is still pending
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request is no longer available for assignment");
        }
        
        // Check if request is already assigned to this volunteer
        if (assignmentRepository.existsByRequestAndVolunteer(request, volunteer)) {
            throw new RuntimeException("Assignment already exists for this request and volunteer");
        }
        
        // Set the actual entities
        assignment.setRequest(request);
        assignment.setVolunteer(volunteer);
        assignment.setAcceptedAt(LocalDateTime.now());
        
        // Update request status to ACCEPTED
        request.setStatus(RequestStatus.ACCEPTED);
        requestRepository.save(request);
        
        System.out.println("✅ Assignment validation passed, saving...");
        Assignment savedAssignment = assignmentRepository.save(assignment);
        System.out.println("✅ Assignment saved with ID: " + savedAssignment.getAssignmentId());
        
        return savedAssignment;
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
                    Request request = assignment.getRequest();
                    request.setStatus(RequestStatus.COMPLETED);
                    requestRepository.save(request);
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