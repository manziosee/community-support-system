package om.community.supportsystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.*;

@RestController
@RequestMapping("/api/expenses")
@Tag(name = "💰 Expenses", description = "Volunteer expense tracking and approvals")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002",
        "http://localhost:3003", "https://community-support-system.vercel.app"})
public class ExpensesController {

    private static final List<Map<String, Object>> store = new ArrayList<>();
    private static long nextId = 1;

    @Operation(summary = "Submit an expense", description = "Submit a new expense claim for a volunteer assignment")
    @ApiResponse(responseCode = "200", description = "Expense submitted successfully")
    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        body.put("expenseId", nextId++);
        body.put("status", "PENDING");
        body.put("createdAt", new Date().toString());
        store.add(new HashMap<>(body));
        return ResponseEntity.ok(body);
    }

    @Operation(summary = "Get expenses by assignment", description = "Retrieve all expenses linked to a specific assignment")
    @ApiResponse(responseCode = "200", description = "Expenses retrieved successfully")
    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<Map<String, Object>>> getByAssignment(@PathVariable Long assignmentId) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> e : store) {
            Object aid = e.get("assignmentId");
            if (aid != null && assignmentId.equals(((Number) aid).longValue())) result.add(e);
        }
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Get expenses by volunteer", description = "Retrieve all expenses submitted by a specific volunteer")
    @ApiResponse(responseCode = "200", description = "Expenses retrieved successfully")
    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<List<Map<String, Object>>> getByVolunteer(@PathVariable Long volunteerId) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> e : store) {
            Object vid = e.get("volunteerId");
            if (vid != null && volunteerId.equals(((Number) vid).longValue())) result.add(e);
        }
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Approve an expense", description = "Approve a pending expense claim")
    @ApiResponse(responseCode = "200", description = "Expense approved successfully")
    @ApiResponse(responseCode = "404", description = "Expense not found")
    @PatchMapping("/{expenseId}/approve")
    public ResponseEntity<Map<String, Object>> approve(@PathVariable Long expenseId) {
        return updateStatus(expenseId, "APPROVED");
    }

    @Operation(summary = "Reject an expense", description = "Reject a pending expense claim")
    @ApiResponse(responseCode = "200", description = "Expense rejected successfully")
    @ApiResponse(responseCode = "404", description = "Expense not found")
    @PatchMapping("/{expenseId}/reject")
    public ResponseEntity<Map<String, Object>> reject(@PathVariable Long expenseId) {
        return updateStatus(expenseId, "REJECTED");
    }

    private ResponseEntity<Map<String, Object>> updateStatus(Long id, String status) {
        for (Map<String, Object> e : store) {
            Object eid = e.get("expenseId");
            if (eid != null && id.equals(((Number) eid).longValue())) {
                e.put("status", status);
                return ResponseEntity.ok(e);
            }
        }
        return ResponseEntity.notFound().build();
    }
}
