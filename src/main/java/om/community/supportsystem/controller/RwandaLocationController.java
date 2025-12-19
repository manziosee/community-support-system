package om.community.supportsystem.controller;

import om.community.supportsystem.service.RwandaLocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/rwanda-locations")
@Tag(name = "🇷🇼 Rwanda Locations", description = "Rwanda administrative divisions from external RDA API")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:5173", "https://community-support-system.vercel.app"}, allowCredentials = "true")
public class RwandaLocationController {
    
    @Autowired
    private RwandaLocationService rwandaLocationService;
    
    @Operation(summary = "Get all provinces", description = "Fetch all provinces in Rwanda from RDA API")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved provinces"),
        @ApiResponse(responseCode = "500", description = "Failed to fetch provinces from external API")
    })
    @GetMapping("/provinces")
    public ResponseEntity<List<String>> getProvinces() {
        try {
            List<String> provinces = rwandaLocationService.getProvinces();
            return ResponseEntity.ok(provinces);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @Operation(summary = "Get districts by province", description = "Fetch districts in a specific province from RDA API")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved districts"),
        @ApiResponse(responseCode = "500", description = "Failed to fetch districts from external API")
    })
    @GetMapping("/districts")
    public ResponseEntity<List<String>> getDistricts(
            @Parameter(description = "Province name", required = true)
            @RequestParam String province) {
        try {
            List<String> districts = rwandaLocationService.getDistricts(province);
            return ResponseEntity.ok(districts);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @Operation(summary = "Get sectors by province and district", description = "Fetch sectors in a specific district")
    @GetMapping("/sectors")
    public ResponseEntity<List<String>> getSectors(
            @Parameter(description = "Province name", required = true)
            @RequestParam String province,
            @Parameter(description = "District name", required = true)
            @RequestParam String district) {
        try {
            List<String> sectors = rwandaLocationService.getSectors(province, district);
            return ResponseEntity.ok(sectors);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @Operation(summary = "Get cells by province, district and sector", description = "Fetch cells in a specific sector")
    @GetMapping("/cells")
    public ResponseEntity<List<String>> getCells(
            @Parameter(description = "Province name", required = true)
            @RequestParam String province,
            @Parameter(description = "District name", required = true)
            @RequestParam String district,
            @Parameter(description = "Sector name", required = true)
            @RequestParam String sector) {
        try {
            List<String> cells = rwandaLocationService.getCells(province, district, sector);
            return ResponseEntity.ok(cells);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @Operation(summary = "Get villages by province, district, sector and cell", description = "Fetch villages in a specific cell")
    @GetMapping("/villages")
    public ResponseEntity<List<String>> getVillages(
            @Parameter(description = "Province name", required = true)
            @RequestParam String province,
            @Parameter(description = "District name", required = true)
            @RequestParam String district,
            @Parameter(description = "Sector name", required = true)
            @RequestParam String sector,
            @Parameter(description = "Cell name", required = true)
            @RequestParam String cell) {
        try {
            List<String> villages = rwandaLocationService.getVillages(province, district, sector, cell);
            return ResponseEntity.ok(villages);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}