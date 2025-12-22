package om.community.supportsystem.controller;

import om.community.supportsystem.config.DataInitializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manual-init")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class ManualInitController {
    
    @Autowired
    private DataInitializer dataInitializer;
    
    @PostMapping("/force")
    public ResponseEntity<?> forceInitialization() {
        try {
            dataInitializer.initializeBasicData();
            return ResponseEntity.ok().body("{\"message\":\"Database initialized successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}