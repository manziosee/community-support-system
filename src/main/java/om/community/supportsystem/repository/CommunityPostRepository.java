package om.community.supportsystem.repository;

import om.community.supportsystem.model.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    List<CommunityPost> findByCategory(String category);
    
    @Query("SELECT p FROM CommunityPost p ORDER BY p.isPinned DESC, p.createdAt DESC")
    List<CommunityPost> findAllOrderByPinnedAndCreatedAt();
    
    @Query("SELECT p FROM CommunityPost p WHERE p.author.userId = :userId ORDER BY p.createdAt DESC")
    List<CommunityPost> findByAuthorUserId(Long userId);
    
    @Query("SELECT p FROM CommunityPost p WHERE p.isPinned = true ORDER BY p.createdAt DESC")
    List<CommunityPost> findPinnedPosts();
}
