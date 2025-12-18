package om.community.supportsystem.config;

import om.community.supportsystem.model.*;
import om.community.supportsystem.service.*;
import om.community.supportsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private LocationService locationService;
    
    @Autowired
    private SkillService skillService;
    
    @Autowired
    private LocationRepository locationRepository;
    
    @Autowired
    private SkillRepository skillRepository;
    
    @Value("${app.data.initialize:true}")
    private boolean initializeData;
    
    @Override
    public void run(String... args) throws Exception {
        if (initializeData) {
            initializeBasicData();
        } else {
            System.out.println("🚫 Data initialization disabled by configuration");
        }
    }
    
    private void initializeBasicData() {
        // Only initialize if database is empty
        if (locationRepository.count() > 0) {
            System.out.println("📊 Database already contains data - skipping initialization");
            System.out.println("   - Locations: " + locationRepository.count());
            System.out.println("   - Skills: " + skillRepository.count());
            System.out.println("✅ Using existing data!");
            return;
        }
        
        System.out.println("🚀 Initializing essential system data (empty database detected)...");
        initializeLocations();
        initializeSkills();
        
        System.out.println("✅ Essential system data initialized successfully!");
        System.out.println("📊 Data loaded:");
        System.out.println("   - 30 Rwandan locations (5 provinces, 30 districts)");
        System.out.println("   - 10 basic skills for volunteers");
        System.out.println("🎯 System ready! Users can now register and create content.");
    }
    
    private void initializeLocations() {
        System.out.println("Creating Rwanda administrative locations...");
        
        // Kigali City (3 Districts)
        locationService.createLocation(new Location("Kigali City", "Gasabo", "KG01"));
        locationService.createLocation(new Location("Kigali City", "Kicukiro", "KG02"));
        locationService.createLocation(new Location("Kigali City", "Nyarugenge", "KG03"));
        
        // Eastern Province (7 Districts)
        locationService.createLocation(new Location("Eastern Province", "Nyagatare", "EP01"));
        locationService.createLocation(new Location("Eastern Province", "Gatsibo", "EP02"));
        locationService.createLocation(new Location("Eastern Province", "Bugesera", "EP03"));
        locationService.createLocation(new Location("Eastern Province", "Kayonza", "EP04"));
        locationService.createLocation(new Location("Eastern Province", "Ngoma", "EP05"));
        locationService.createLocation(new Location("Eastern Province", "Kirehe", "EP06"));
        locationService.createLocation(new Location("Eastern Province", "Rwamagana", "EP07"));
        
        // Western Province (7 Districts)
        locationService.createLocation(new Location("Western Province", "Rusizi", "WP01"));
        locationService.createLocation(new Location("Western Province", "Rubavu", "WP02"));
        locationService.createLocation(new Location("Western Province", "Nyamasheke", "WP03"));
        locationService.createLocation(new Location("Western Province", "Ngororero", "WP04"));
        locationService.createLocation(new Location("Western Province", "Karongi", "WP05"));
        locationService.createLocation(new Location("Western Province", "Rutsiro", "WP06"));
        locationService.createLocation(new Location("Western Province", "Nyabihu", "WP07"));
        
        // Southern Province (8 Districts)
        locationService.createLocation(new Location("Southern Province", "Kamonyi", "SP01"));
        locationService.createLocation(new Location("Southern Province", "Nyamagabe", "SP02"));
        locationService.createLocation(new Location("Southern Province", "Huye", "SP03"));
        locationService.createLocation(new Location("Southern Province", "Nyanza", "SP04"));
        locationService.createLocation(new Location("Southern Province", "Gisagara", "SP05"));
        locationService.createLocation(new Location("Southern Province", "Ruhango", "SP06"));
        locationService.createLocation(new Location("Southern Province", "Muhanga", "SP07"));
        locationService.createLocation(new Location("Southern Province", "Nyaruguru", "SP08"));
        
        // Northern Province (5 Districts)
        locationService.createLocation(new Location("Northern Province", "Gicumbi", "NP01"));
        locationService.createLocation(new Location("Northern Province", "Gakenke", "NP02"));
        locationService.createLocation(new Location("Northern Province", "Burera", "NP03"));
        locationService.createLocation(new Location("Northern Province", "Rulindo", "NP04"));
        locationService.createLocation(new Location("Northern Province", "Musanze", "NP05"));
    }
    
    private void initializeSkills() {
        System.out.println("Creating basic skill categories...");
        skillService.createSkill(new Skill("Programming", "Software development and coding"));
        skillService.createSkill(new Skill("Tutoring", "Academic tutoring and teaching"));
        skillService.createSkill(new Skill("Delivery", "Package and grocery delivery services"));
        skillService.createSkill(new Skill("Tech Support", "Computer and technology assistance"));
        skillService.createSkill(new Skill("Cooking", "Meal preparation and cooking assistance"));
        skillService.createSkill(new Skill("Healthcare", "Medical assistance and health support"));
        skillService.createSkill(new Skill("Construction", "Building and repair services"));
        skillService.createSkill(new Skill("Transportation", "Vehicle and transport services"));
        skillService.createSkill(new Skill("Agriculture", "Farming and agricultural support"));
        skillService.createSkill(new Skill("Education", "Teaching and educational support"));
    }
}