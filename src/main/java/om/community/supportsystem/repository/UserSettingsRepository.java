package om.community.supportsystem.repository;

import om.community.supportsystem.model.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    
    Optional<UserSettings> findByUserUserId(Long userId);
    
    boolean existsByUserUserId(Long userId);
    
    void deleteByUserUserId(Long userId);
}