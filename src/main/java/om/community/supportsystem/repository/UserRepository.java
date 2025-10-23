package om.community.supportsystem.repository;

import om.community.supportsystem.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find by email
    Optional<User> findByEmail(String email);
    
    // Find by role
    List<User> findByRole(User.Role role);
    
    // Find by location province code
    @Query("SELECT u FROM User u WHERE u.location.provinceCode = :provinceCode")
    List<User> findByLocationProvinceCode(@Param("provinceCode") String provinceCode);
    
    // Find by location province name
    @Query("SELECT u FROM User u WHERE u.location.province = :province")
    List<User> findByLocationProvince(@Param("province") String province);
    
    // Check if user exists by email
    boolean existsByEmail(String email);
    
    // Find volunteers in specific location
    @Query("SELECT u FROM User u WHERE u.role = 'VOLUNTEER' AND u.location.province = :province")
    List<User> findVolunteersByProvince(@Param("province") String province);
    
    // Find users created after specific date
    List<User> findByCreatedAtAfter(LocalDateTime date);
    
    // Find with pagination and sorting
    Page<User> findByRoleAndLocation_Province(User.Role role, String province, Pageable pageable);
    
    // Count users by role
    long countByRole(User.Role role);
    
    // Find users by name containing (case insensitive)
    List<User> findByNameContainingIgnoreCase(String name);
}