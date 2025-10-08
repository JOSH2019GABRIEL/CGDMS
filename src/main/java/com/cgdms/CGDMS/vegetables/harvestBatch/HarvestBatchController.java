package com.cgdms.CGDMS.vegetables.harvestBatch;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("harvest-batches")
@Tag(name = "Harvest Batches")
public class HarvestBatchController {

    @Autowired
    private HarvestBatchService harvestBatchService;

    @PostMapping
    public ResponseEntity<HarvestBatchRequest> saveHarvestBatch(@Valid @RequestBody HarvestBatchRequest request) {
        return ResponseEntity.ok(harvestBatchService.saveHarvest(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<HarvestBatchResponse>> findAll(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(harvestBatchService.findAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HarvestBatchResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(harvestBatchService.findById(id));
    }

    @PutMapping("/archive/{id}")
    public ResponseEntity<String> archive(@PathVariable Long id) {
        harvestBatchService.delete(id);
        return ResponseEntity.ok("Harvest batch archived successfully");
    }
}
