package om.community.supportsystem.controller;

import om.community.supportsystem.model.SystemSettings;
import om.community.supportsystem.service.SystemSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/system/settings")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "https://community-support-system.vercel.app"})
public class SystemSettingsController {
    
    @Autowired
    private SystemSettingsService settingsService;
    
    @GetMapping
    public ResponseEntity<List<SystemSettings>> getAllSettings() {
        return ResponseEntity.ok(settingsService.getAllSettings());
    }
    
    @GetMapping("/{key}")
    public ResponseEntity<SystemSettings> getSettingByKey(@PathVariable String key) {
        return settingsService.getSettingByKey(key)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{key}")
    public ResponseEntity<SystemSettings> updateSetting(@PathVariable String key, @RequestBody Map<String, String> body) {
        String value = body.get("value");
        return ResponseEntity.ok(settingsService.updateSetting(key, value));
    }
    
    @DeleteMapping("/{key}")
    public ResponseEntity<Void> deleteSetting(@PathVariable String key) {
        settingsService.deleteSetting(key);
        return ResponseEntity.ok().build();
    }
}
