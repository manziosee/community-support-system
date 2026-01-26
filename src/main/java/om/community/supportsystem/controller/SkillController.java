package om.community.supportsystem.controller;

import om.community.supportsystem.model.Skill;
import om.community.supportsystem.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@Tag(name = "🎯 Skills", description = "Skill management APIs - volunteer capabilities, search, and popularity tracking")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class SkillController {
    
    @Autowired
    private SkillService skillService;
    
    // Create
    @Operation(summary = "Create new skill", description = "Create a new skill that volunteers can possess")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Skill created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid skill data or skill already exists")
    })
    @PostMapping
    public ResponseEntity<Skill> createSkill(@RequestBody Skill skill) {
        try {
            Skill createdSkill = skillService.createSkill(skill);
            return ResponseEntity.ok(createdSkill);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Read
    @Operation(summary = "Get all skills", description = "Retrieve all available skills in the system")
    @ApiResponse(responseCode = "200", description = "Skills retrieved successfully")
    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        List<Skill> skills = skillService.getAllSkills();
        return ResponseEntity.ok(skills);
    }
    
    @Operation(summary = "Get skill by ID", description = "Retrieve a specific skill by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Skill found"),
        @ApiResponse(responseCode = "404", description = "Skill not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Skill> getSkillById(
            @Parameter(description = "Skill ID", required = true) @PathVariable Long id) {
        return skillService.getSkillById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/name/{skillName}")
    public ResponseEntity<Skill> getSkillByName(@PathVariable String skillName) {
        return skillService.getSkillByName(skillName)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/ordered")
    public ResponseEntity<List<Skill>> getAllSkillsOrderedByName() {
        List<Skill> skills = skillService.getAllSkillsOrderedByName();
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/search/name/{skillName}")
    public ResponseEntity<List<Skill>> searchSkillsByName(@PathVariable String skillName) {
        List<Skill> skills = skillService.searchSkillsByName(skillName);
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/search/description/{description}")
    public ResponseEntity<List<Skill>> searchSkillsByDescription(@PathVariable String description) {
        List<Skill> skills = skillService.searchSkillsByDescription(description);
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<Skill>> searchSkillsByNameWithPagination(
            @RequestParam String skillName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "skillName") String sortBy) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Skill> skills = skillService.searchSkillsByName(skillName, pageable);
        return ResponseEntity.ok(skills);
    }
    
    @Operation(summary = "Get popular skills", description = "Get skills ordered by the number of users who have them")
    @ApiResponse(responseCode = "200", description = "Popular skills retrieved successfully")
    @GetMapping("/popular")
    public ResponseEntity<List<Object[]>> getSkillsOrderByUserCount() {
        List<Object[]> skills = skillService.getSkillsOrderByUserCount();
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/unused")
    public ResponseEntity<List<Skill>> getSkillsWithNoUsers() {
        List<Skill> skills = skillService.getSkillsWithNoUsers();
        return ResponseEntity.ok(skills);
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable Long id, @RequestBody Skill skillDetails) {
        try {
            Skill updatedSkill = skillService.updateSkill(id, skillDetails);
            return ResponseEntity.ok(updatedSkill);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
    
    // Utility endpoints
    @GetMapping("/exists/name/{skillName}")
    public ResponseEntity<Boolean> existsBySkillName(@PathVariable String skillName) {
        boolean exists = skillService.existsBySkillName(skillName);
        return ResponseEntity.ok(exists);
    }
}