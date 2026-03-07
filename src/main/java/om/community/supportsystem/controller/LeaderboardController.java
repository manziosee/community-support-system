package om.community.supportsystem.controller;

import om.community.supportsystem.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "https://community-support-system.vercel.app"})
public class LeaderboardController {
    
    @Autowired
    private LeaderboardService leaderboardService;
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(leaderboardService.getTopVolunteers(limit));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserRank(@PathVariable Long userId) {
        Map<String, Object> rank = leaderboardService.getUserRank(userId);
        if (rank != null) {
            return ResponseEntity.ok(rank);
        }
        return ResponseEntity.notFound().build();
    }
}
