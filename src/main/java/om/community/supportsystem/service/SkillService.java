package om.community.supportsystem.service;

import om.community.supportsystem.model.Skill;
import om.community.supportsystem.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SkillService {
    
    @Autowired
    private SkillRepository skillRepository;
    
    // Create
    public Skill createSkill(Skill skill) {
        if (skillRepository.existsBySkillName(skill.getSkillName())) {
            throw new RuntimeException("Skill with name " + skill.getSkillName() + " already exists");
        }
        return skillRepository.save(skill);
    }
    
    // Read
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }
    
    public Optional<Skill> getSkillById(Long id) {
        return skillRepository.findById(id);
    }
    
    public Optional<Skill> getSkillByName(String skillName) {
        return skillRepository.findBySkillName(skillName);
    }
    
    public List<Skill> getAllSkillsOrderedByName() {
        return skillRepository.findAllByOrderBySkillNameAsc();
    }
    
    public List<Skill> searchSkillsByName(String skillName) {
        return skillRepository.findBySkillNameContainingIgnoreCase(skillName);
    }
    
    public List<Skill> searchSkillsByDescription(String description) {
        return skillRepository.findByDescriptionContainingIgnoreCase(description);
    }
    
    public Page<Skill> searchSkillsByName(String skillName, Pageable pageable) {
        return skillRepository.findBySkillNameContainingIgnoreCase(skillName, pageable);
    }
    
    public List<Object[]> getSkillsOrderByUserCount() {
        return skillRepository.findSkillsOrderByUserCount();
    }
    
    public List<Skill> getSkillsWithNoUsers() {
        return skillRepository.findSkillsWithNoUsers();
    }
    
    // Update
    public Skill updateSkill(Long id, Skill skillDetails) {
        return skillRepository.findById(id)
                .map(skill -> {
                    skill.setSkillName(skillDetails.getSkillName());
                    skill.setDescription(skillDetails.getDescription());
                    return skillRepository.save(skill);
                })
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + id));
    }
    
    // Delete
    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }
    
    // Utility methods
    public boolean existsBySkillName(String skillName) {
        return skillRepository.existsBySkillName(skillName);
    }
}