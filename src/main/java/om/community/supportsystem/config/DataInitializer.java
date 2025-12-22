package om.community.supportsystem.config;

import om.community.supportsystem.model.*;
import om.community.supportsystem.service.*;
import om.community.supportsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
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
        initializeAdminUser();
        
        System.out.println("✅ Essential system data initialized successfully!");
        System.out.println("📊 Data loaded:");
        System.out.println("   - 30 Rwandan locations (5 provinces, 30 districts)");
        System.out.println("   - 45+ comprehensive skills across all service categories");
        System.out.println("   - Admin user created (oseemanzi3@gmail.com)");
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
        System.out.println("Creating comprehensive skill categories...");
        
        // Technology & Digital Skills
        skillService.createSkill(new Skill("Programming", "Software development, coding, and web development"));
        skillService.createSkill(new Skill("Tech Support", "Computer repair, software installation, and IT assistance"));
        skillService.createSkill(new Skill("Digital Marketing", "Social media management, online advertising, and SEO"));
        skillService.createSkill(new Skill("Graphic Design", "Logo design, branding, and visual content creation"));
        skillService.createSkill(new Skill("Data Entry", "Document processing, spreadsheet management, and data organization"));
        
        // Education & Training
        skillService.createSkill(new Skill("Tutoring", "Academic tutoring in mathematics, science, and languages"));
        skillService.createSkill(new Skill("Education", "Teaching, curriculum development, and educational support"));
        skillService.createSkill(new Skill("Language Translation", "Translation services for English, French, Kinyarwanda, and Swahili"));
        skillService.createSkill(new Skill("Music Lessons", "Piano, guitar, singing, and music theory instruction"));
        skillService.createSkill(new Skill("Art & Crafts", "Painting, drawing, pottery, and traditional crafts"));
        
        // Health & Wellness
        skillService.createSkill(new Skill("Healthcare", "Medical assistance, first aid, and health consultations"));
        skillService.createSkill(new Skill("Mental Health Support", "Counseling, therapy, and emotional support services"));
        skillService.createSkill(new Skill("Fitness Training", "Personal training, yoga, and physical fitness coaching"));
        skillService.createSkill(new Skill("Nutrition Counseling", "Diet planning, nutrition advice, and healthy eating guidance"));
        
        // Home & Maintenance
        skillService.createSkill(new Skill("Construction", "Building, renovation, and structural repair services"));
        skillService.createSkill(new Skill("Plumbing", "Pipe repair, water system installation, and plumbing maintenance"));
        skillService.createSkill(new Skill("Electrical Work", "Wiring, electrical repairs, and appliance installation"));
        skillService.createSkill(new Skill("Carpentry", "Furniture making, wood repair, and custom woodwork"));
        skillService.createSkill(new Skill("Painting & Decoration", "House painting, interior design, and home decoration"));
        skillService.createSkill(new Skill("Gardening", "Landscaping, plant care, and garden maintenance"));
        skillService.createSkill(new Skill("Cleaning Services", "House cleaning, office cleaning, and deep cleaning"));
        
        // Transportation & Logistics
        skillService.createSkill(new Skill("Transportation", "Personal transport, taxi services, and vehicle assistance"));
        skillService.createSkill(new Skill("Delivery", "Package delivery, grocery delivery, and courier services"));
        skillService.createSkill(new Skill("Moving Services", "Furniture moving, packing, and relocation assistance"));
        skillService.createSkill(new Skill("Vehicle Repair", "Car maintenance, motorcycle repair, and automotive services"));
        
        // Food & Hospitality
        skillService.createSkill(new Skill("Cooking", "Meal preparation, catering, and culinary services"));
        skillService.createSkill(new Skill("Baking", "Bread making, cake decoration, and pastry services"));
        skillService.createSkill(new Skill("Event Catering", "Wedding catering, party planning, and event food services"));
        skillService.createSkill(new Skill("Restaurant Service", "Waitressing, bartending, and hospitality services"));
        
        // Agriculture & Environment
        skillService.createSkill(new Skill("Agriculture", "Crop farming, livestock care, and agricultural consulting"));
        skillService.createSkill(new Skill("Animal Care", "Pet sitting, veterinary assistance, and animal training"));
        skillService.createSkill(new Skill("Environmental Services", "Waste management, recycling, and environmental consulting"));
        
        // Business & Finance
        skillService.createSkill(new Skill("Accounting", "Bookkeeping, tax preparation, and financial management"));
        skillService.createSkill(new Skill("Business Consulting", "Startup advice, business planning, and entrepreneurship support"));
        skillService.createSkill(new Skill("Legal Services", "Legal advice, document preparation, and legal consultation"));
        skillService.createSkill(new Skill("Insurance Services", "Insurance advice, claims processing, and policy guidance"));
        
        // Personal & Social Services
        skillService.createSkill(new Skill("Childcare", "Babysitting, nanny services, and child supervision"));
        skillService.createSkill(new Skill("Elderly Care", "Senior assistance, companionship, and elderly support"));
        skillService.createSkill(new Skill("Personal Shopping", "Grocery shopping, errands, and personal assistance"));
        skillService.createSkill(new Skill("Event Planning", "Wedding planning, party organization, and event coordination"));
        skillService.createSkill(new Skill("Photography", "Portrait photography, event photography, and photo editing"));
        skillService.createSkill(new Skill("Hair & Beauty", "Hairdressing, makeup, and beauty services"));
        
        // Specialized Services
        skillService.createSkill(new Skill("Security Services", "Property security, event security, and safety consulting"));
        skillService.createSkill(new Skill("Tailoring", "Clothing alterations, custom tailoring, and garment repair"));
        skillService.createSkill(new Skill("Shoe Repair", "Cobbler services, shoe restoration, and leather repair"));
        skillService.createSkill(new Skill("Watch Repair", "Timepiece repair, battery replacement, and watch maintenance"));
    }
    
    private void initializeAdminUser() {
        System.out.println("Creating system administrator account...");
        
        // Check if admin user already exists
        if (userRepository.existsByEmail("oseemanzi3@gmail.com")) {
            System.out.println("⚠️ Admin user already exists - skipping creation");
            return;
        }
        
        // Get Kigali City location for admin user
        Location adminLocation = locationRepository.findByProvinceAndDistrict("Kigali City", "Gasabo")
            .orElse(null);
        
        // Create admin user
        User admin = new User();
        admin.setName("admin");
        admin.setEmail("oseemanzi3@gmail.com");
        admin.setPhoneNumber("0788000000"); // Default admin phone
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(UserRole.ADMIN);
        admin.setEmailVerified(true); // Admin is pre-verified
        admin.setLocation(adminLocation);
        admin.setProvince("Kigali City");
        admin.setDistrict("Gasabo");
        admin.setSector("Remera");
        admin.setCell("Nyabisindu");
        admin.setVillage("Kabeza");
        
        userRepository.save(admin);
        System.out.println("✅ Admin user created successfully!");
        System.out.println("   - Email: oseemanzi3@gmail.com");
        System.out.println("   - Password: admin123");
        System.out.println("   - Role: ADMIN");
    }
}