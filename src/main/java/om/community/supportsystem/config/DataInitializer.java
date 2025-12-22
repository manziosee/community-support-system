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
    
    @Value("${app.data.initialize:false}")
    private boolean initializeData;
    
    @Override
    public void run(String... args) throws Exception {
        if (initializeData) {
            initializeBasicData();
        } else {
            System.out.println("🚫 Data initialization disabled by configuration");
        }
    }
    
    public void initializeBasicData() {
        // Force initialization regardless of existing data
        System.out.println("🚀 Force initializing system data...");
        initializeLocations();
        initializeSkills();
        initializeAdminUser();
        
        System.out.println("✅ System data initialized successfully!");
        System.out.println("📊 Data loaded:");
        System.out.println("   - Locations: " + locationRepository.count());
        System.out.println("   - Skills: " + skillRepository.count());
        System.out.println("   - Admin user: oseemanzi3@gmail.com");
    }
    
    private void initializeLocations() {
        System.out.println("Creating Rwanda administrative locations...");
        
        // Check if locations already exist
        if (locationRepository.count() > 0) {
            System.out.println("⚠️ Locations already exist - skipping creation");
            return;
        }
        
        // Kigali City (3 Districts)
        createLocationIfNotExists("Kigali City", "Gasabo", "KG01");
        createLocationIfNotExists("Kigali City", "Kicukiro", "KG02");
        createLocationIfNotExists("Kigali City", "Nyarugenge", "KG03");
        
        // Eastern Province (7 Districts)
        createLocationIfNotExists("Eastern Province", "Nyagatare", "EP01");
        createLocationIfNotExists("Eastern Province", "Gatsibo", "EP02");
        createLocationIfNotExists("Eastern Province", "Bugesera", "EP03");
        createLocationIfNotExists("Eastern Province", "Kayonza", "EP04");
        createLocationIfNotExists("Eastern Province", "Ngoma", "EP05");
        createLocationIfNotExists("Eastern Province", "Kirehe", "EP06");
        createLocationIfNotExists("Eastern Province", "Rwamagana", "EP07");
        
        // Western Province (7 Districts)
        createLocationIfNotExists("Western Province", "Rusizi", "WP01");
        createLocationIfNotExists("Western Province", "Rubavu", "WP02");
        createLocationIfNotExists("Western Province", "Nyamasheke", "WP03");
        createLocationIfNotExists("Western Province", "Ngororero", "WP04");
        createLocationIfNotExists("Western Province", "Karongi", "WP05");
        createLocationIfNotExists("Western Province", "Rutsiro", "WP06");
        createLocationIfNotExists("Western Province", "Nyabihu", "WP07");
        
        // Southern Province (8 Districts)
        createLocationIfNotExists("Southern Province", "Kamonyi", "SP01");
        createLocationIfNotExists("Southern Province", "Nyamagabe", "SP02");
        createLocationIfNotExists("Southern Province", "Huye", "SP03");
        createLocationIfNotExists("Southern Province", "Nyanza", "SP04");
        createLocationIfNotExists("Southern Province", "Gisagara", "SP05");
        createLocationIfNotExists("Southern Province", "Ruhango", "SP06");
        createLocationIfNotExists("Southern Province", "Muhanga", "SP07");
        createLocationIfNotExists("Southern Province", "Nyaruguru", "SP08");
        
        // Northern Province (5 Districts)
        createLocationIfNotExists("Northern Province", "Gicumbi", "NP01");
        createLocationIfNotExists("Northern Province", "Gakenke", "NP02");
        createLocationIfNotExists("Northern Province", "Burera", "NP03");
        createLocationIfNotExists("Northern Province", "Rulindo", "NP04");
        createLocationIfNotExists("Northern Province", "Musanze", "NP05");
    }
    
    private void createLocationIfNotExists(String province, String district, String provinceCode) {
        if (!locationService.existsByProvinceCode(provinceCode)) {
            locationService.createLocation(new Location(province, district, provinceCode));
        }
    }
    
    private void initializeSkills() {
        System.out.println("Creating comprehensive skill categories...");
        
        // Force creation of all skills (will skip duplicates)
        createSkillIfNotExists("Programming", "Software development, coding, and web development");
        createSkillIfNotExists("Tech Support", "Computer repair, software installation, and IT assistance");
        createSkillIfNotExists("Digital Marketing", "Social media management, online advertising, and SEO");
        createSkillIfNotExists("Graphic Design", "Logo design, branding, and visual content creation");
        createSkillIfNotExists("Data Entry", "Document processing, spreadsheet management, and data organization");
        
        // Education & Training
        createSkillIfNotExists("Tutoring", "Academic tutoring in mathematics, science, and languages");
        createSkillIfNotExists("Education", "Teaching, curriculum development, and educational support");
        createSkillIfNotExists("Language Translation", "Translation services for English, French, Kinyarwanda, and Swahili");
        createSkillIfNotExists("Music Lessons", "Piano, guitar, singing, and music theory instruction");
        createSkillIfNotExists("Art & Crafts", "Painting, drawing, pottery, and traditional crafts");
        
        // Health & Wellness
        createSkillIfNotExists("Healthcare", "Medical assistance, first aid, and health consultations");
        createSkillIfNotExists("Mental Health Support", "Counseling, therapy, and emotional support services");
        createSkillIfNotExists("Fitness Training", "Personal training, yoga, and physical fitness coaching");
        createSkillIfNotExists("Nutrition Counseling", "Diet planning, nutrition advice, and healthy eating guidance");
        
        // Home & Maintenance
        createSkillIfNotExists("Construction", "Building, renovation, and structural repair services");
        createSkillIfNotExists("Plumbing", "Pipe repair, water system installation, and plumbing maintenance");
        createSkillIfNotExists("Electrical Work", "Wiring, electrical repairs, and appliance installation");
        createSkillIfNotExists("Carpentry", "Furniture making, wood repair, and custom woodwork");
        createSkillIfNotExists("Painting & Decoration", "House painting, interior design, and home decoration");
        createSkillIfNotExists("Gardening", "Landscaping, plant care, and garden maintenance");
        createSkillIfNotExists("Cleaning Services", "House cleaning, office cleaning, and deep cleaning");
        
        // Transportation & Logistics
        createSkillIfNotExists("Transportation", "Personal transport, taxi services, and vehicle assistance");
        createSkillIfNotExists("Delivery", "Package delivery, grocery delivery, and courier services");
        createSkillIfNotExists("Moving Services", "Furniture moving, packing, and relocation assistance");
        createSkillIfNotExists("Vehicle Repair", "Car maintenance, motorcycle repair, and automotive services");
        
        // Food & Hospitality
        createSkillIfNotExists("Cooking", "Meal preparation, catering, and culinary services");
        createSkillIfNotExists("Baking", "Bread making, cake decoration, and pastry services");
        createSkillIfNotExists("Event Catering", "Wedding catering, party planning, and event food services");
        createSkillIfNotExists("Restaurant Service", "Waitressing, bartending, and hospitality services");
        
        // Agriculture & Environment
        createSkillIfNotExists("Agriculture", "Crop farming, livestock care, and agricultural consulting");
        createSkillIfNotExists("Animal Care", "Pet sitting, veterinary assistance, and animal training");
        createSkillIfNotExists("Environmental Services", "Waste management, recycling, and environmental consulting");
        
        // Business & Finance
        createSkillIfNotExists("Accounting", "Bookkeeping, tax preparation, and financial management");
        createSkillIfNotExists("Business Consulting", "Startup advice, business planning, and entrepreneurship support");
        createSkillIfNotExists("Legal Services", "Legal advice, document preparation, and legal consultation");
        createSkillIfNotExists("Insurance Services", "Insurance advice, claims processing, and policy guidance");
        
        // Personal & Social Services
        createSkillIfNotExists("Childcare", "Babysitting, nanny services, and child supervision");
        createSkillIfNotExists("Elderly Care", "Senior assistance, companionship, and elderly support");
        createSkillIfNotExists("Personal Shopping", "Grocery shopping, errands, and personal assistance");
        createSkillIfNotExists("Event Planning", "Wedding planning, party organization, and event coordination");
        createSkillIfNotExists("Photography", "Portrait photography, event photography, and photo editing");
        createSkillIfNotExists("Hair & Beauty", "Hairdressing, makeup, and beauty services");
        
        // Specialized Services
        createSkillIfNotExists("Security Services", "Property security, event security, and safety consulting");
        createSkillIfNotExists("Tailoring", "Clothing alterations, custom tailoring, and garment repair");
        createSkillIfNotExists("Shoe Repair", "Cobbler services, shoe restoration, and leather repair");
        createSkillIfNotExists("Watch Repair", "Timepiece repair, battery replacement, and watch maintenance");
        
        System.out.println("✅ Skills initialization completed. Total skills: " + skillRepository.count());
    }
    
    private void createSkillIfNotExists(String name, String description) {
        if (!skillRepository.existsBySkillName(name)) {
            skillService.createSkill(new Skill(name, description));
            System.out.println("➕ Created skill: " + name);
        } else {
            System.out.println("⚠️ Skill already exists: " + name);
        }
    }
    
    private void initializeAdminUser() {
        System.out.println("Creating system administrator account...");
        
        // Force creation of admin user
        if (userRepository.existsByEmail("oseemanzi3@gmail.com")) {
            System.out.println("⚠️ Admin user already exists - updating if needed");
            // Update existing admin user
            User existingAdmin = userRepository.findByEmail("oseemanzi3@gmail.com").orElse(null);
            if (existingAdmin != null && existingAdmin.getRole() != UserRole.ADMIN) {
                existingAdmin.setRole(UserRole.ADMIN);
                existingAdmin.setName("admin");
                userRepository.save(existingAdmin);
                System.out.println("✅ Updated existing user to admin role");
            }
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