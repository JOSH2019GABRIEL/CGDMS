package com.cgdms.CGDMS.processing.cutupyield;


import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("cutup-yields")
@Tag(name = "Cutup Yields")
public class CutupYieldController {

    @Autowired
    private CutupYieldService cutupYieldService;

    // Save a new cutup yield record
    @PostMapping
    public ResponseEntity<CutupYieldRequest> saveCutupYield(
            @Valid @RequestBody CutupYieldRequest cutupYieldRequest
    ) {
        return ResponseEntity.ok(cutupYieldService.saveCutupYield(cutupYieldRequest));
    }

    // Get all cutup yields (paginated)
    @GetMapping
    public ResponseEntity<PageResponse<CutupYieldResponse>> findAllCutupYields(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(cutupYieldService.findAllCutupYields(page, size));
    }

    // Get a single cutup yield record by ID
    @GetMapping("/{cutup-id}")
    public ResponseEntity<CutupYieldResponse> getCutupYield(@PathVariable("cutup-id") Long cutupId) {
        return ResponseEntity.ok(cutupYieldService.findById(cutupId));
    }

    // Archive cutup yield record (soft delete)
    @PutMapping("/archive/{id}")
    public ResponseEntity<?> archiveCutupYield(@PathVariable Long id) {
        cutupYieldService.deleteCutupYield(id);
        return ResponseEntity.ok("Cutup Yield deleted successfully");
    }
}
