package om.community.supportsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "skills")
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long skillId;
    
    @Column(nullable = false, unique = true)
    private String skillName;
    
    @Column(length = 500)
    private String description;
    
    // Many-to-Many: Skills can belong to many users
    @ManyToMany(mappedBy = "skills", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<User> users;
    
    // Constructors
    public Skill() {}
    
    public Skill(String skillName, String description) {
        this.skillName = skillName;
        this.description = description;
    }
    
    // Getters and Setters
    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }
    
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Set<User> getUsers() { return users; }
    public void setUsers(Set<User> users) { this.users = users; }
}