package om.community.supportsystem.service;

import om.community.supportsystem.model.RequestStatus;
import om.community.supportsystem.model.UserRole;
import om.community.supportsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private LocationRepository locationRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        stats.put("totalUsers", userRepository.count());
        stats.put("totalVolunteers", userRepository.countByRole(UserRole.VOLUNTEER));
        stats.put("totalCitizens", userRepository.countByRole(UserRole.CITIZEN));
        
        // Request statistics
        stats.put("totalRequests", requestRepository.count());
        stats.put("pendingRequests", requestRepository.countByStatus(RequestStatus.PENDING));
        stats.put("completedRequests", requestRepository.countByStatus(RequestStatus.COMPLETED));
        
        // Assignment statistics
        stats.put("totalAssignments", assignmentRepository.count());
        stats.put("completedAssignments", assignmentRepository.countByCompletedAtIsNotNull());
        
        // Other statistics
        stats.put("totalSkills", skillRepository.count());
        stats.put("totalLocations", locationRepository.count());
        
        return stats;
    }
}