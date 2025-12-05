package om.community.supportsystem.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import om.community.supportsystem.model.Assignment;
import om.community.supportsystem.model.Request;
import om.community.supportsystem.model.User;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    // Find by volunteer
    List<Assignment> findByVolunteer(User volunteer);
    
    // Find by request
    List<Assignment> findByRequest(Request request);
    
    // Find by volunteer ID
    List<Assignment> findByVolunteerUserId(Long volunteerId);
    
    // Find completed assignments
    List<Assignment> findByCompletedAtIsNotNull();
    
    // Find pending assignments (not completed)
    List<Assignment> findByCompletedAtIsNull();
    
    // Check if assignment exists for request and volunteer
    boolean existsByRequestAndVolunteer(Request request, User volunteer);
    
    // Find assignments accepted after specific date
    List<Assignment> findByAcceptedAtAfter(LocalDateTime date);
    
    
    // Find current assignment for a request (not completed)
    Optional<Assignment> findByRequestAndCompletedAtIsNull(Request request);
    
    // Find with pagination and sorting
    Page<Assignment> findByVolunteerOrderByAcceptedAtDesc(User volunteer, Pageable pageable);
    
    // Count assignments by volunteer
    long countByVolunteer(User volunteer);
    
    // Count completed assignments by volunteer
    long countByVolunteerAndCompletedAtIsNotNull(User volunteer);
    
    // Find assignments by volunteer location
    @Query("SELECT a FROM Assignment a WHERE a.volunteer.location.province = :province")
    List<Assignment> findByVolunteerLocationProvince(@Param("province") String province);
    
    // Find top volunteers by assignment count
    @Query("SELECT a.volunteer, COUNT(a) as assignmentCount FROM Assignment a GROUP BY a.volunteer ORDER BY assignmentCount DESC")
    List<Object[]> findTopVolunteersByAssignmentCount();
}