package om.community.supportsystem.controller;

import om.community.supportsystem.model.Achievement;
import om.community.supportsystem.service.AchievementService;
import om.community.supportsystem.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.*;

@RestController
@RequestMapping("/api/gamification")
@Tag(name = "🏆 Gamification", description = "Points, levels, leaderboard and achievements")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002",
        "http://localhost:3003", "https://community-support-system.vercel.app"})
public class GamificationController {

    @Autowired
    private LeaderboardService leaderboardService;

    @Autowired
    private AchievementService achievementService;

    @Operation(summary = "Get gamification profile for a user", description = "Returns points, level, rank, and achievements for a specific user")
    @ApiResponse(responseCode = "200", description = "Profile retrieved successfully")
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserProfile(@PathVariable Long userId) {
        Map<String, Object> rank = leaderboardService.getUserRank(userId);
        long completedAssignments = 0;
        if (rank != null && rank.get("completedAssignments") != null) {
            Object val = rank.get("completedAssignments");
            completedAssignments = val instanceof Number ? ((Number) val).longValue() : 0L;
        }
        long points = completedAssignments * 10;
        int level = (int)(points / 100) + 1;

        List<Achievement> achievements = achievementService.getUserAchievements(userId);
        Long achievementCount = achievementService.getUserAchievementCount(userId);

        Map<String, Object> profile = new HashMap<>();
        profile.put("userId", userId);
        profile.put("points", points);
        profile.put("level", level);
        profile.put("rank", rank != null ? rank.get("rank") : null);
        profile.put("completedAssignments", completedAssignments);
        profile.put("achievements", achievements);
        profile.put("achievementCount", achievementCount);
        profile.put("badges", achievementCount);
        return ResponseEntity.ok(profile);
    }

    @Operation(summary = "Get volunteer leaderboard", description = "Returns ranked list of top volunteers by completed assignments")
    @ApiResponse(responseCode = "200", description = "Leaderboard retrieved successfully")
    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard(
            @RequestParam(defaultValue = "allTime") String period,
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> board = leaderboardService.getTopVolunteers(limit);
        for (int i = 0; i < board.size(); i++) {
            board.get(i).put("rank", i + 1);
        }
        return ResponseEntity.ok(board);
    }

    @Operation(summary = "Add points to a user", description = "Manually award points to a user for a specific reason")
    @ApiResponse(responseCode = "200", description = "Points added successfully")
    @PostMapping("/user/{userId}/points")
    public ResponseEntity<Map<String, Object>> addPoints(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> body) {
        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("pointsAdded", body.get("points"));
        result.put("reason", body.get("reason"));
        result.put("success", true);
        return ResponseEntity.ok(result);
    }
}
