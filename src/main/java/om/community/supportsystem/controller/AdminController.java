package om.community.supportsystem.controller;

import om.community.supportsystem.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "https://community-support-system.vercel.app"})
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> analytics = adminService.getAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Admin API is running");
    }
}