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
        // Create sample locations (Rwandan administrative structure)
        Location kigali = new Location("Kigali", "Gasabo", "Remera", "Gisozi", "Ubumwe", "KG");
        Location eastern = new Location("Eastern", "Rwamagana", "Muhazi", "Gahengeri", "Kabare", "EP");
        Location western = new Location("Western", "Rubavu", "Gisenyi", "Nyundo", "Cyanzarwe", "WP");
        Location northern = new Location("Northern", "Musanze", "Muhoza", "Nyakinama", "Cyuve", "NP");
        Location southern = new Location("Southern", "Huye", "Ngoma", "Matyazo", "Rwaniro", "SP");
        
        locationService.createLocation(kigali);
        locationService.createLocation(eastern);
        locationService.createLocation(western);
        locationService.createLocation(northern);
        locationService.createLocation(southern);
        
        // Create sample skills
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
        
        // Create sample users
        User citizen1 = new User("Jean Uwimana", "jean@example.com", "password123", User.Role.CITIZEN, kigali);
        User citizen2 = new User("Marie Mukamana", "marie@example.com", "password123", User.Role.CITIZEN, eastern);
        User volunteer1 = new User("Paul Kagame", "paul@example.com", "password123", User.Role.VOLUNTEER, kigali);
        User volunteer2 = new User("Grace Uwase", "grace@example.com", "password123", User.Role.VOLUNTEER, western);
        User volunteer3 = new User("David Nkurunziza", "david@example.com", "password123", User.Role.VOLUNTEER, northern);
        
        userService.createUser(citizen1);
        userService.createUser(citizen2);
        userService.createUser(volunteer1);
        userService.createUser(volunteer2);
        userService.createUser(volunteer3);
        
        // Create sample requests
        Request request1 = new Request("Grocery Delivery Needed", "Need someone to deliver groceries from Simba Supermarket to my home in Remera", citizen1);
        Request request2 = new Request("Math Tutoring for High School", "Looking for a math tutor for my daughter who is in S4", citizen2);
        Request request3 = new Request("Computer Setup Help", "Need help setting up my new laptop and installing software", citizen1);
        
        requestService.createRequest(request1);
        requestService.createRequest(request2);
        requestService.createRequest(request3);
        
        // Create sample notifications
        notificationService.createNotification("Welcome to Community Support System!", citizen1);
        notificationService.createNotification("Your request has been posted successfully", citizen1);
        notificationService.createNotification("New volunteer opportunities available in your area", volunteer1);
        notificationService.createNotification("Thank you for joining as a volunteer!", volunteer2);
        
        System.out.println("Sample data initialized successfully!");
    }
}