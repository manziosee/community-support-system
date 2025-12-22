package om.community.supportsystem.service;

import om.community.supportsystem.model.Request;
import om.community.supportsystem.model.Skill;
import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.RequestRepository;
import om.community.supportsystem.repository.SkillRepository;
import om.community.supportsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SearchService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private SkillRepository skillRepository;

    public Map<String, Object> globalSearch(String query, int limit) {
        Map<String, Object> results = new HashMap<>();
        
        // Search users
        List<User> users = userRepository.findByNameContainingIgnoreCase(query)
            .stream()
            .limit(limit)
            .collect(Collectors.toList());
        results.put("users", users);
        
        // Search requests
        List<Request> requests = requestRepository.findByTitleContainingIgnoreCase(query)
            .stream()
            .limit(limit)
            .collect(Collectors.toList());
        results.put("requests", requests);
        
        // Search skills
        List<Skill> skills = skillRepository.findBySkillNameContainingIgnoreCase(query)
            .stream()
            .limit(limit)
            .collect(Collectors.toList());
        results.put("skills", skills);
        
        // Add counts
        results.put("totalUsers", users.size());
        results.put("totalRequests", requests.size());
        results.put("totalSkills", skills.size());
        results.put("query", query);
        
        return results;
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByNameContainingIgnoreCase(query);
    }

    public List<Request> searchRequests(String query) {
        return requestRepository.findByTitleContainingIgnoreCase(query);
    }

    public List<Skill> searchSkills(String query) {
        return skillRepository.findBySkillNameContainingIgnoreCase(query);
    }
}