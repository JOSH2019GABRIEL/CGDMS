package com.cgdms.CGDMS.processing.waste;


import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("wastes")
@Tag(name = "Wastes")
public class WastesController {

    @Autowired
    private WastesService wastesService;

    // Save a new waste record
    @PostMapping
    public ResponseEntity<WastesRequest> saveWaste(
            @Valid @RequestBody WastesRequest wastesRequest
    ) {
        return ResponseEntity.ok(wastesService.saveWaste(wastesRequest));
    }

    // Get all wastes (paginated)
    @GetMapping
    public ResponseEntity<PageResponse<WastesResponse>> findAllWastes(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(wastesService.findAllWastes(page, size));
    }

    // Get a single waste record by ID
    @GetMapping("/{waste-id}")
    public ResponseEntity<WastesResponse> getWaste(@PathVariable("waste-id") Long wasteId) {
        return ResponseEntity.ok(wastesService.findById(wasteId));
    }

    // Archive waste record (soft delete)
    @PutMapping("/archive/{id}")
    public ResponseEntity<?> archiveWaste(@PathVariable Long id) {
        wastesService.deleteWaste(id);
        return ResponseEntity.ok("Waste record deleted successfully");
    }
}
