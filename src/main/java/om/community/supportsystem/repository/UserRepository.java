package om.community.supportsystem.repository;

import om.community.supportsystem.model.User;
import om.community.supportsystem.model.UserRole;
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
    List<User> findByRole(UserRole role);
    
    // Find by location province code
    @Query("SELECT u FROM User u WHERE u.location.provinceCode = :provinceCode")
    List<User> findByLocationProvinceCode(@Param("provinceCode") String provinceCode);
    
    // Find by location province name
    @Query("SELECT u FROM User u WHERE u.location.province = :province")
    List<User> findByLocationProvince(@Param("province") String province);
    
    // Find by user's province field
    List<User> findByProvince(String province);
    
    // Find by user's district field
    List<User> findByDistrict(String district);
    
    // Find by province and district
    List<User> findByProvinceAndDistrict(String province, String district);
    
    // Find by sector
    List<User> findBySector(String sector);
    
    // Find by cell
    List<User> findByCell(String cell);
    
    // Find by village
    List<User> findByVillage(String village);
    
    // Check if user exists by email
    boolean existsByEmail(String email);
    
    // Check if user exists by phone number
    boolean existsByPhoneNumber(String phoneNumber);
    
    // Find volunteers in specific location
    @Query("SELECT u FROM User u WHERE u.role = 'VOLUNTEER' AND u.location.province = :province")
    List<User> findVolunteersByProvince(@Param("province") String province);
    
    // Find users created after specific date
    List<User> findByCreatedAtAfter(LocalDateTime date);
    
    // Find with pagination and sorting
    Page<User> findByRoleAndLocation_Province(UserRole role, String province, Pageable pageable);
    
    // Count users by role
    long countByRole(UserRole role);
    
    // Find users by name containing (case insensitive)
    List<User> findByNameContainingIgnoreCase(String name);
    
    // Find user by phone number
    Optional<User> findByPhoneNumber(String phoneNumber);
    
    // Authentication methods
    Optional<User> findByEmailVerificationToken(String token);
    Optional<User> findByPasswordResetToken(String token);
    List<User> findByPasswordResetTokenIsNotNull();
    
    // Dashboard statistics methods
    long countByAccountLockedFalse();
    long countByAccountLockedTrue();
    long countByEmailVerifiedTrue();
    long countByEmailVerifiedFalse();
    long countByTwoFactorEnabledTrue();
    
    // Analytics methods
    long countByRole(String role);
    long countByProvince(String province);
}