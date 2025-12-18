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

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class SkillController {
    
    @Autowired
    private SkillService skillService;
    
    // Create
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
    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        List<Skill> skills = skillService.getAllSkills();
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Skill> getSkillById(@PathVariable Long id) {
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