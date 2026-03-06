package om.community.supportsystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.*;

@RestController
@RequestMapping("/api/appointments")
@Tag(name = "📆 Appointments", description = "Scheduling appointments between citizens and volunteers")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002",
        "http://localhost:3003", "https://community-support-system.vercel.app"})
public class AppointmentsController {

    private static final List<Map<String, Object>> store = new ArrayList<>();
    private static long nextId = 1;

    @Operation(summary = "Create an appointment", description = "Schedule a new appointment between a citizen and a volunteer")
    @ApiResponse(responseCode = "200", description = "Appointment created successfully")
    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        body.put("appointmentId", nextId++);
        body.put("status", "SCHEDULED");
        body.put("createdAt", new Date().toString());
        store.add(new HashMap<>(body));
        return ResponseEntity.ok(body);
    }

    @Operation(summary = "Get appointments for a user", description = "Retrieve all appointments for a specific user (citizen or volunteer)")
    @ApiResponse(responseCode = "200", description = "Appointments retrieved successfully")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getByUser(@PathVariable Long userId) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> a : store) {
            Object uid = a.get("userId");
            if (uid != null && userId.equals(((Number) uid).longValue())) result.add(a);
        }
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Update an appointment", description = "Update appointment details such as time or notes")
    @ApiResponse(responseCode = "200", description = "Appointment updated successfully")
    @ApiResponse(responseCode = "404", description = "Appointment not found")
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        for (Map<String, Object> a : store) {
            Object aid = a.get("appointmentId");
            if (aid != null && id.equals(((Number) aid).longValue())) {
                a.putAll(body);
                return ResponseEntity.ok(a);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Cancel an appointment", description = "Cancel a scheduled appointment by ID")
    @ApiResponse(responseCode = "200", description = "Appointment cancelled successfully")
    @ApiResponse(responseCode = "404", description = "Appointment not found")
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancel(@PathVariable Long id) {
        for (Map<String, Object> a : store) {
            Object aid = a.get("appointmentId");
            if (aid != null && id.equals(((Number) aid).longValue())) {
                a.put("status", "CANCELLED");
                return ResponseEntity.ok(a);
            }
        }
        return ResponseEntity.notFound().build();
    }
}
