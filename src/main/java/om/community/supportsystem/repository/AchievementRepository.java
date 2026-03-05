package om.community.supportsystem.repository;

import om.community.supportsystem.model.Achievement;
import om.community.supportsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByUser(User user);
    List<Achievement> findByUserUserId(Long userId);
    
    @Query("SELECT a FROM Achievement a WHERE a.user.userId = :userId ORDER BY a.earnedAt DESC")
    List<Achievement> findByUserIdOrderByEarnedAtDesc(Long userId);
    
    Long countByUserUserId(Long userId);
}
