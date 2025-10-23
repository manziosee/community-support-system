package om.community.supportsystem.repository;

import om.community.supportsystem.model.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    
    // Find by skill name
    Optional<Skill> findBySkillName(String skillName);
    
    // Find by skill name containing (case insensitive)
    List<Skill> findBySkillNameContainingIgnoreCase(String skillName);
    
    // Check if skill exists by name
    boolean existsBySkillName(String skillName);
    
    // Find all skills ordered by name
    List<Skill> findAllByOrderBySkillNameAsc();
    
    // Find with pagination and sorting
    Page<Skill> findBySkillNameContainingIgnoreCase(String skillName, Pageable pageable);
    
    // Find skills by description containing
    List<Skill> findByDescriptionContainingIgnoreCase(String description);
    
    // Find most popular skills (by user count)
    @Query("SELECT s, COUNT(u) as userCount FROM Skill s LEFT JOIN s.users u GROUP BY s ORDER BY userCount DESC")
    List<Object[]> findSkillsOrderByUserCount();
    
    // Find skills with no users
    @Query("SELECT s FROM Skill s WHERE s.users IS EMPTY")
    List<Skill> findSkillsWithNoUsers();
}