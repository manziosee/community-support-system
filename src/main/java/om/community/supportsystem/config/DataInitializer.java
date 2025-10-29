package om.community.supportsystem.config;

import om.community.supportsystem.model.*;
import om.community.supportsystem.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private LocationService locationService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private SkillService skillService;
    
    @Autowired
    private RequestService requestService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Override
    public void run(String... args) throws Exception {
        initializeData();
    }
    
    private void initializeData() {
        // Create sample locations (Correct Rwandan administrative structure)
        // Check if locations already exist to avoid duplicates
        if (locationService.getAllLocations().isEmpty()) {
            // Kigali City
            Location gasabo = new Location("Kigali City", "Gasabo", "Remera", "Gisozi", "Ubumwe", "KG01");
            Location kicukiro = new Location("Kigali City", "Kicukiro", "Niboye", "Kagarama", "Nyarugunga", "KG02");
            Location nyarugenge = new Location("Kigali City", "Nyarugenge", "Nyarugenge", "Rwezamenyo", "Biryogo", "KG03");
            
            // Eastern Province
            Location nyagatare = new Location("Eastern Province", "Nyagatare", "Nyagatare", "Rukomo", "Karama", "EP01");
            Location gatsibo = new Location("Eastern Province", "Gatsibo", "Gatsibo", "Gitoki", "Kageyo", "EP02");
            Location bugesera = new Location("Eastern Province", "Bugesera", "Ntarama", "Zaza", "Mayange", "EP03");
            Location kayonza = new Location("Eastern Province", "Kayonza", "Kayonza", "Mukarange", "Murama", "EP04");
            Location ngoma = new Location("Eastern Province", "Ngoma", "Sake", "Mugesera", "Kibungo", "EP05");
            Location kirehe = new Location("Eastern Province", "Kirehe", "Kirehe", "Nasho", "Mahama", "EP06");
            Location rwamagana = new Location("Eastern Province", "Rwamagana", "Muhazi", "Gahengeri", "Kabare", "EP07");
            
            // Western Province
            Location rusizi = new Location("Western Province", "Rusizi", "Kamembe", "Muganza", "Nkanka", "WP01");
            Location rubavu = new Location("Western Province", "Rubavu", "Gisenyi", "Nyundo", "Cyanzarwe", "WP02");
            Location nyamasheke = new Location("Western Province", "Nyamasheke", "Kagano", "Kanjongo", "Nyabitekeri", "WP03");
            Location ngororero = new Location("Western Province", "Ngororero", "Bwira", "Matyazo", "Gatumba", "WP04");
            Location karongi = new Location("Western Province", "Karongi", "Bwishyura", "Mutuntu", "Bwishyura", "WP05");
            Location rutsiro = new Location("Western Province", "Rutsiro", "Kigeyo", "Ruhango", "Mushonyi", "WP06");
            Location nyabihu = new Location("Western Province", "Nyabihu", "Mukamira", "Jenda", "Shyira", "WP07");
            
            // Southern Province
            Location kamonyi = new Location("Southern Province", "Kamonyi", "Kamonyi", "Rugalika", "Nyamiyaga", "SP01");
            Location nyamagabe = new Location("Southern Province", "Nyamagabe", "Gasaka", "Mushubi", "Tare", "SP02");
            Location huye = new Location("Southern Province", "Huye", "Ngoma", "Matyazo", "Rwaniro", "SP03");
            Location nyanza = new Location("Southern Province", "Nyanza", "Busasamana", "Rwabicuma", "Cyabakamyi", "SP04");
            Location gisagara = new Location("Southern Province", "Gisagara", "Save", "Kigembe", "Mamba", "SP05");
            Location ruhango = new Location("Southern Province", "Ruhango", "Ruhango", "Kabagari", "Muhanga", "SP06");
            Location muhanga = new Location("Southern Province", "Muhanga", "Muhanga", "Cyeza", "Shyogwe", "SP07");
            Location nyaruguru = new Location("Southern Province", "Nyaruguru", "Nyamagabe", "Kibeho", "Cyanika", "SP08");
            
            // Northern Province
            Location gicumbi = new Location("Northern Province", "Gicumbi", "Byumba", "Bungwe", "Cyumba", "NP01");
            Location gakenke = new Location("Northern Province", "Gakenke", "Gakenke", "Janja", "Kivuruga", "NP02");
            Location burera = new Location("Northern Province", "Burera", "Cyeru", "Butaro", "Nemba", "NP03");
            Location rulindo = new Location("Northern Province", "Rulindo", "Base", "Burega", "Cyinzuzi", "NP04");
            Location musanze = new Location("Northern Province", "Musanze", "Muhoza", "Nyakinama", "Cyuve", "NP05");
        
            // Save all locations
            locationService.createLocation(gasabo);
            locationService.createLocation(kicukiro);
            locationService.createLocation(nyarugenge);
            locationService.createLocation(nyagatare);
            locationService.createLocation(gatsibo);
            locationService.createLocation(bugesera);
            locationService.createLocation(kayonza);
            locationService.createLocation(ngoma);
            locationService.createLocation(kirehe);
            locationService.createLocation(rwamagana);
            locationService.createLocation(rusizi);
            locationService.createLocation(rubavu);
            locationService.createLocation(nyamasheke);
            locationService.createLocation(ngororero);
            locationService.createLocation(karongi);
            locationService.createLocation(rutsiro);
            locationService.createLocation(nyabihu);
            locationService.createLocation(kamonyi);
            locationService.createLocation(nyamagabe);
            locationService.createLocation(huye);
            locationService.createLocation(nyanza);
            locationService.createLocation(gisagara);
            locationService.createLocation(ruhango);
            locationService.createLocation(muhanga);
            locationService.createLocation(nyaruguru);
            locationService.createLocation(gicumbi);
            locationService.createLocation(gakenke);
            locationService.createLocation(burera);
            locationService.createLocation(rulindo);
            locationService.createLocation(musanze);
        }
        
        // Create sample skills
        if (skillService.getAllSkills().isEmpty()) {
            Skill programming = new Skill("Programming", "Software development and coding");
            Skill tutoring = new Skill("Tutoring", "Academic tutoring and teaching");
            Skill delivery = new Skill("Delivery", "Package and grocery delivery services");
            Skill techSupport = new Skill("Tech Support", "Computer and technology assistance");
            Skill cooking = new Skill("Cooking", "Meal preparation and cooking assistance");
            
            skillService.createSkill(programming);
            skillService.createSkill(tutoring);
            skillService.createSkill(delivery);
            skillService.createSkill(techSupport);
            skillService.createSkill(cooking);
        }
        
        // Create sample users
        if (userService.getAllUsers().isEmpty()) {
            List<Location> locations = locationService.getAllLocations();
            if (!locations.isEmpty()) {
                Location gasaboLoc = locations.stream().filter(l -> "KG01".equals(l.getProvinceCode())).findFirst().orElse(locations.get(0));
                Location rwamaganaLoc = locations.stream().filter(l -> "EP07".equals(l.getProvinceCode())).findFirst().orElse(locations.get(1));
                Location kicukiroLoc = locations.stream().filter(l -> "KG02".equals(l.getProvinceCode())).findFirst().orElse(locations.get(2));
                Location rubavuLoc = locations.stream().filter(l -> "WP02".equals(l.getProvinceCode())).findFirst().orElse(locations.get(3));
                Location musanzeLoc = locations.stream().filter(l -> "NP05".equals(l.getProvinceCode())).findFirst().orElse(locations.get(4));
                
                User citizen1 = new User("Jean Uwimana", "jean@example.com", "password123", User.Role.CITIZEN, gasaboLoc);
                User citizen2 = new User("Marie Mukamana", "marie@example.com", "password123", User.Role.CITIZEN, rwamaganaLoc);
                User volunteer1 = new User("Paul Kagame", "paul@example.com", "password123", User.Role.VOLUNTEER, kicukiroLoc);
                User volunteer2 = new User("Grace Uwase", "grace@example.com", "password123", User.Role.VOLUNTEER, rubavuLoc);
                User volunteer3 = new User("David Nkurunziza", "david@example.com", "password123", User.Role.VOLUNTEER, musanzeLoc);
                
                userService.createUser(citizen1);
                userService.createUser(citizen2);
                userService.createUser(volunteer1);
                userService.createUser(volunteer2);
                userService.createUser(volunteer3);
            }
        }
        
        // Create sample requests
        if (requestService.getAllRequests().isEmpty()) {
            User citizen1 = userService.getUserByEmail("jean@example.com").orElse(null);
            User citizen2 = userService.getUserByEmail("marie@example.com").orElse(null);
            
            if (citizen1 != null && citizen2 != null) {
                Request request1 = new Request("Grocery Delivery Needed", "Need someone to deliver groceries from Simba Supermarket to my home in Remera", citizen1);
                Request request2 = new Request("Math Tutoring for High School", "Looking for a math tutor for my daughter who is in S4", citizen2);
                Request request3 = new Request("Computer Setup Help", "Need help setting up my new laptop and installing software", citizen1);
                
                requestService.createRequest(request1);
                requestService.createRequest(request2);
                requestService.createRequest(request3);
            }
        }
        
        // Create sample notifications
        if (notificationService.getAllNotifications().isEmpty()) {
            User citizen1 = userService.getUserByEmail("jean@example.com").orElse(null);
            User volunteer1 = userService.getUserByEmail("paul@example.com").orElse(null);
            User volunteer2 = userService.getUserByEmail("grace@example.com").orElse(null);
            
            if (citizen1 != null && volunteer1 != null && volunteer2 != null) {
                notificationService.createNotification("Welcome to Community Support System!", citizen1);
                notificationService.createNotification("Your request has been posted successfully", citizen1);
                notificationService.createNotification("New volunteer opportunities available in your area", volunteer1);
                notificationService.createNotification("Thank you for joining as a volunteer!", volunteer2);
            }
        }
        
        System.out.println("Sample data initialized successfully!");
    }
}