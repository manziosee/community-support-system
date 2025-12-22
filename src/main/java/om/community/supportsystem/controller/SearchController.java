package om.community.supportsystem.controller;

import om.community.supportsystem.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "https://community-support-system.vercel.app"})
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> globalSearch(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Query parameter is required"));
        }
        
        Map<String, Object> results = searchService.globalSearch(query.trim(), limit);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/users")
    public ResponseEntity<?> searchUsers(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Query parameter is required"));
        }
        
        return ResponseEntity.ok(searchService.searchUsers(query.trim()));
    }

    @GetMapping("/requests")
    public ResponseEntity<?> searchRequests(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Query parameter is required"));
        }
        
        return ResponseEntity.ok(searchService.searchRequests(query.trim()));
    }

    @GetMapping("/skills")
    public ResponseEntity<?> searchSkills(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Query parameter is required"));
        }
        
        return ResponseEntity.ok(searchService.searchSkills(query.trim()));
    }
}