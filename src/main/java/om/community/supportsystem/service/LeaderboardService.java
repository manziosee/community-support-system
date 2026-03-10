package om.community.supportsystem.service;

import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class LeaderboardService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    /**
     * Returns top volunteers sorted by completed assignments.
     * Uses a single GROUP BY query — no N+1.
     */
    @Cacheable(value = "leaderboard", key = "#limit")
    public List<Map<String, Object>> getTopVolunteers(int limit) {
        List<Object[]> rows = assignmentRepository.findVolunteerCompletedCountsDesc();
        List<Map<String, Object>> result = new ArrayList<>();
        int rank = 1;
        for (Object[] row : rows) {
            if (result.size() >= limit) break;
            User user = (User) row[0];
            long completedCount = ((Number) row[1]).longValue();
            Map<String, Object> entry = new HashMap<>();
            entry.put("userId", user.getUserId());
            entry.put("name", user.getName());
            entry.put("email", user.getEmail());
            entry.put("completedAssignments", completedCount);
            entry.put("points", completedCount * 10);
            entry.put("rank", rank++);
            result.add(entry);
        }
        return result;
    }

    public Map<String, Object> getUserRank(Long userId) {
        List<Map<String, Object>> leaderboard = getTopVolunteers(Integer.MAX_VALUE);
        return leaderboard.stream()
            .filter(e -> userId.equals((Long) e.get("userId")))
            .findFirst()
            .orElse(null);
    }
}