package om.community.supportsystem.controller;

import om.community.supportsystem.model.Achievement;
import om.community.supportsystem.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "*")
public class AchievementController {
    
    @Autowired
    private AchievementService achievementService;
    
    @GetMapping
    public ResponseEntity<List<Achievement>> getAllAchievements() {
        return ResponseEntity.ok(achievementService.getAllAchievements());
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Achievement>> getUserAchievements(@PathVariable Long userId) {
        return ResponseEntity.ok(achievementService.getUserAchievements(userId));
    }
    
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getUserAchievementCount(@PathVariable Long userId) {
        return ResponseEntity.ok(achievementService.getUserAchievementCount(userId));
    }
    
    @PostMapping
    public ResponseEntity<Achievement> createAchievement(@RequestBody Achievement achievement) {
        return ResponseEntity.ok(achievementService.createAchievement(achievement));
    }
}
