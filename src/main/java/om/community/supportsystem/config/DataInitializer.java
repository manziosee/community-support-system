package om.community.supportsystem.config;

import om.community.supportsystem.model.*;
import om.community.supportsystem.service.*;
import om.community.supportsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private LocationService locationService;
    
    @Autowired
    private SkillService skillService;
    
    @Autowired
    private LocationRepository locationRepository;
    
    @Autowired
    private SkillRepository skillRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        try {
            initializeBasicData();
        } catch (Exception e) {
            logger.error("Failed to initialize data: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    private void initializeBasicData() {
        // Only initialize if database is empty
        if (locationRepository.count() > 0) {
            logger.info("Database already contains data - skipping initialization");
            logger.info("Locations: {}, Skills: {}", locationRepository.count(), skillRepository.count());
            return;
        }
        
        logger.info("Initializing fresh data (empty database detected)...");
        // Create locations with Province + District only
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
        
        // Initialize skills
        logger.info("Creating skills...");
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
        
        // Create default admin user
        if (!userService.existsByEmail("admin@community.rw")) {
            logger.info("Creating default admin user...");
            User admin = new User();
            admin.setName("System Administrator");
            admin.setEmail("admin@community.rw");
            admin.setPhoneNumber("0788000000");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(UserRole.ADMIN);
            admin.setEmailVerified(true);
            admin.setLocation(locationService.getLocationById(1L).orElse(null));
            admin.setSector("Kimironko");
            admin.setCell("Bibare");
            admin.setVillage("Kamatamu");
            
            userService.createUser(admin);
        }
        
        logger.info("Fresh database initialized successfully!");
        logger.info("Data loaded: 30 locations, 10 skills, default admin user");
        logger.info("Ready for API testing! Admin: admin@community.rw / admin123");
    }
}