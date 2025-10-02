package com.cgdms.CGDMS.processing.byproduct;


import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("byproducts")
@Tag(name = "Byproducts")
public class ByproductController {

    @Autowired
    private ByproductService byproductService;

    // Save a new byproduct record
    @PostMapping
    public ResponseEntity<ByproductsRequest> saveByproduct(
            @Valid @RequestBody ByproductsRequest byproductRequest
    ) {
        return ResponseEntity.ok(byproductService.saveByproduct(byproductRequest));
    }

    // Get all byproducts (paginated)
    @GetMapping
    public ResponseEntity<PageResponse<ByproductsResponse>> findAllByproducts(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(byproductService.findAllByproducts(page, size));
    }

    // Get a single byproduct record by ID
    @GetMapping("/{byproduct-id}")
    public ResponseEntity<ByproductsResponse> getByproduct(@PathVariable("byproduct-id") Long byproductId) {
        return ResponseEntity.ok(byproductService.findById(byproductId));
    }

    // Archive byproduct record (soft delete)
    @PutMapping("/archive/{id}")
    public ResponseEntity<?> archiveByproduct(@PathVariable Long id) {
        byproductService.deleteByproduct(id);
        return ResponseEntity.ok("Byproduct deleted successfully");
    }
}
