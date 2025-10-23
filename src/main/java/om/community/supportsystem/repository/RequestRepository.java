package om.community.supportsystem.repository;

import om.community.supportsystem.model.Request;
import om.community.supportsystem.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    
    // Find by status
    List<Request> findByStatus(Request.Status status);
    
    // Find by citizen
    List<Request> findByCitizen(User citizen);
    
    // Find by citizen ID
    List<Request> findByCitizenUserId(Long citizenId);
    
    // Find pending requests
    List<Request> findByStatusOrderByCreatedAtDesc(Request.Status status);
    
    // Check if request exists by title and citizen
    boolean existsByTitleAndCitizen(String title, User citizen);
    
    // Find requests created after specific date
    List<Request> findByCreatedAtAfter(LocalDateTime date);
    
    // Find requests by location province
    @Query("SELECT r FROM Request r WHERE r.citizen.location.province = :province")
    List<Request> findByLocationProvince(@Param("province") String province);
    
    // Find with pagination and sorting
    Page<Request> findByStatusAndCitizen_Location_Province(Request.Status status, String province, Pageable pageable);
    
    // Count requests by status
    long countByStatus(Request.Status status);
    
    // Find requests by title containing (case insensitive)
    List<Request> findByTitleContainingIgnoreCase(String title);
    
    // Find recent requests (last 7 days)
    @Query("SELECT r FROM Request r WHERE r.createdAt >= :weekAgo ORDER BY r.createdAt DESC")
    List<Request> findRecentRequests(@Param("weekAgo") LocalDateTime weekAgo);
}