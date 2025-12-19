package om.community.supportsystem.controller;

import om.community.supportsystem.model.RequestCategory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "📂 Request Categories", description = "APIs for managing request categories - 8 predefined categories for help requests")
public class CategoryController {
    
    @Operation(
        summary = "Get all request categories", 
        description = "Retrieve all 8 predefined request categories as string array: General Help, Transportation, Technology Support, Shopping and Errands, Tutoring and Education, Household Tasks, Healthcare Assistance, Others"
    )
    @ApiResponse(responseCode = "200", description = "Categories retrieved successfully", 
        content = @io.swagger.v3.oas.annotations.media.Content(
            mediaType = "application/json",
            schema = @io.swagger.v3.oas.annotations.media.Schema(
                example = "[\"General Help\", \"Transportation\", \"Technology Support\", \"Shopping and Errands\", \"Tutoring and Education\", \"Household Tasks\", \"Healthcare Assistance\", \"Others\"]"
            )
        )
    )
    @GetMapping
    public ResponseEntity<List<String>> getAllCategories() {
        try {
            List<String> categories = Arrays.stream(RequestCategory.values())
                    .map(RequestCategory::getDisplayName)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            System.err.println("Error in getAllCategories: " + e.getMessage());
            e.printStackTrace();
            // Return simple string array as fallback
            List<String> fallbackCategories = Arrays.stream(RequestCategory.values())
                    .map(category -> category.name().replace("_", " "))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(fallbackCategories);
        }
    }
}