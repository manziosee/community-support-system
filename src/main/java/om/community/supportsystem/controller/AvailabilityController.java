package om.community.supportsystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.*;

@RestController
@RequestMapping("/api/availability")
@Tag(name = "📅 Availability", description = "Volunteer availability scheduling and status")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002",
        "http://localhost:3003", "https://community-support-system.vercel.app"})
public class AvailabilityController {

    // In-memory store until a proper DB table is added
    private static final Map<Long, Map<String, Object>> availabilityStore = new HashMap<>();

    @Operation(summary = "Get volunteer availability", description = "Retrieve availability slots and status for a specific volunteer")
    @ApiResponse(responseCode = "200", description = "Availability retrieved successfully")
    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<Map<String, Object>> getAvailability(@PathVariable Long volunteerId) {
        Map<String, Object> data = availabilityStore.getOrDefault(volunteerId, defaultAvailability(volunteerId));
        return ResponseEntity.ok(data);
    }

    @Operation(summary = "Save volunteer availability", description = "Save or update availability slots for a volunteer")
    @ApiResponse(responseCode = "200", description = "Availability saved successfully")
    @PostMapping("/volunteer/{volunteerId}")
    public ResponseEntity<Map<String, Object>> saveAvailability(
            @PathVariable Long volunteerId,
            @RequestBody Map<String, Object> body) {
        body.put("volunteerId", volunteerId);
        availabilityStore.put(volunteerId, body);
        return ResponseEntity.ok(body);
    }

    @Operation(summary = "Update volunteer status", description = "Update a volunteer's online/offline status")
    @ApiResponse(responseCode = "200", description = "Status updated successfully")
    @PatchMapping("/volunteer/{volunteerId}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long volunteerId,
            @RequestBody Map<String, Object> body) {
        Map<String, Object> current = availabilityStore.getOrDefault(volunteerId, defaultAvailability(volunteerId));
        current.put("status", body.get("status"));
        availabilityStore.put(volunteerId, current);
        return ResponseEntity.ok(current);
    }

    private Map<String, Object> defaultAvailability(Long volunteerId) {
        Map<String, Object> def = new HashMap<>();
        def.put("volunteerId", volunteerId);
        def.put("status", "OFFLINE");
        def.put("slots", new ArrayList<>());
        return def;
    }
}
