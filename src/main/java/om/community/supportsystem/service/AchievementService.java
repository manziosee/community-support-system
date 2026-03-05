package om.community.supportsystem.service;

import om.community.supportsystem.model.Achievement;
import om.community.supportsystem.model.User;
import om.community.supportsystem.repository.AchievementRepository;
import om.community.supportsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AchievementService {
    
    @Autowired
    private AchievementRepository achievementRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }
    
    public List<Achievement> getUserAchievements(Long userId) {
        return achievementRepository.findByUserIdOrderByEarnedAtDesc(userId);
    }
    
    public Achievement createAchievement(Achievement achievement) {
        return achievementRepository.save(achievement);
    }
    
    public void awardAchievement(Long userId, String title, String description, String badgeType, Integer points) {
        User user = userRepository.findById(userId).orElseThrow();
        Achievement achievement = new Achievement();
        achievement.setUser(user);
        achievement.setTitle(title);
        achievement.setDescription(description);
        achievement.setBadgeType(badgeType);
        achievement.setPoints(points);
        achievementRepository.save(achievement);
    }
    
    public Long getUserAchievementCount(Long userId) {
        return achievementRepository.countByUserUserId(userId);
    }
}
