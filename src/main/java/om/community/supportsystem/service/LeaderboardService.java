package om.community.supportsystem.service;

import om.community.supportsystem.repository.AssignmentRepository;
import om.community.supportsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    public List<Map<String, Object>> getTopVolunteers(int limit) {
        return userRepository.findAll().stream()
            .filter(user -> "VOLUNTEER".equals(user.getRole()))
            .map(user -> {
                Long completedCount = assignmentRepository.countByVolunteerUserIdAndCompletedAtIsNotNull(user.getUserId());
                Map<String, Object> entry = new HashMap<>();
                entry.put("userId", user.getUserId());
                entry.put("name", user.getName());
                entry.put("email", user.getEmail());
                entry.put("completedAssignments", completedCount);
                entry.put("points", completedCount * 10);
                entry.put("rank", 0);
                return entry;
            })
            .sorted((a, b) -> Long.compare((Long)b.get("completedAssignments"), (Long)a.get("completedAssignments")))
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    public Map<String, Object> getUserRank(Long userId) {
        List<Map<String, Object>> leaderboard = getTopVolunteers(1000);
        for (int i = 0; i < leaderboard.size(); i++) {
            Map<String, Object> entry = leaderboard.get(i);
            entry.put("rank", i + 1);
            if (userId.equals(entry.get("userId"))) {
                return entry;
            }
        }
        return null;
    }
}
