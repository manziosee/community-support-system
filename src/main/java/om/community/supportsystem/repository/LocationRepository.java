package om.community.supportsystem.repository;

import om.community.supportsystem.model.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    
    // Find by province code
    List<Location> findByProvinceCode(String provinceCode);
    
    // Find by province name
    List<Location> findByProvince(String province);
    
    // Find by district
    List<Location> findByDistrict(String district);
    
    // Check if location exists by province code
    boolean existsByProvinceCode(String provinceCode);
    
    // Find all provinces (distinct)
    @Query("SELECT DISTINCT l.province FROM Location l ORDER BY l.province")
    List<String> findAllProvinces();
    
    // Find districts by province
    @Query("SELECT DISTINCT l.district FROM Location l WHERE l.province = :province ORDER BY l.district")
    List<String> findDistrictsByProvince(@Param("province") String province);
    
    // Find with pagination and sorting
    Page<Location> findByProvinceContainingIgnoreCase(String province, Pageable pageable);
    
    // Custom query to find locations with users count
    @Query("SELECT l FROM Location l LEFT JOIN l.users u GROUP BY l ORDER BY COUNT(u) DESC")
    List<Location> findLocationsOrderByUserCount();
}