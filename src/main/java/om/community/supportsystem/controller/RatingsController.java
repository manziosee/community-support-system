package om.community.supportsystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.*;

@RestController
@RequestMapping("/api/ratings")
@Tag(name = "⭐ Ratings", description = "Volunteer ratings and reviews")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002",
        "http://localhost:3003", "https://community-support-system.vercel.app"})
public class RatingsController {

    // In-memory store until a Ratings table is added
    private static final List<Map<String, Object>> ratingsStore = new ArrayList<>();
    private static long nextId = 1;

    @Operation(summary = "Create a rating", description = "Submit a rating for a volunteer after an assignment")
    @ApiResponse(responseCode = "200", description = "Rating created successfully")
    @PostMapping
    public ResponseEntity<Map<String, Object>> createRating(@RequestBody Map<String, Object> body) {
        body.put("ratingId", nextId++);
        body.put("createdAt", new Date().toString());
        ratingsStore.add(new HashMap<>(body));
        return ResponseEntity.ok(body);
    }

    @Operation(summary = "Get ratings for a volunteer", description = "Retrieve all ratings submitted for a specific volunteer")
    @ApiResponse(responseCode = "200", description = "Ratings retrieved successfully")
    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<List<Map<String, Object>>> getRatingsByVolunteer(@PathVariable Long volunteerId) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> r : ratingsStore) {
            Object vid = r.get("volunteerId");
            if (vid != null && volunteerId.equals(((Number) vid).longValue())) {
                result.add(r);
            }
        }
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Get ratings for an assignment", description = "Retrieve all ratings associated with a specific assignment")
    @ApiResponse(responseCode = "200", description = "Ratings retrieved successfully")
    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<Map<String, Object>>> getRatingsByAssignment(@PathVariable Long assignmentId) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> r : ratingsStore) {
            Object aid = r.get("assignmentId");
            if (aid != null && assignmentId.equals(((Number) aid).longValue())) {
                result.add(r);
            }
        }
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Get average rating for a volunteer", description = "Calculate the average rating score for a specific volunteer")
    @ApiResponse(responseCode = "200", description = "Average rating calculated successfully")
    @GetMapping("/volunteer/{volunteerId}/average")
    public ResponseEntity<Map<String, Object>> getVolunteerAverage(@PathVariable Long volunteerId) {
        List<Map<String, Object>> volRatings = new ArrayList<>();
        for (Map<String, Object> r : ratingsStore) {
            Object vid = r.get("volunteerId");
            if (vid != null && volunteerId.equals(((Number) vid).longValue())) {
                volRatings.add(r);
            }
        }
        double avg = volRatings.stream()
            .mapToDouble(r -> r.get("score") != null ? ((Number) r.get("score")).doubleValue() : 0)
            .average().orElse(0.0);
        Map<String, Object> result = new HashMap<>();
        result.put("volunteerId", volunteerId);
        result.put("averageScore", Math.round(avg * 10.0) / 10.0);
        result.put("totalRatings", volRatings.size());
        return ResponseEntity.ok(result);
    }
}
