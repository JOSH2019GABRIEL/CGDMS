package com.cgdms.CGDMS.broiler.weightsample;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("weight-samples")
@Tag(name = "Weight Samples")
public class WeightSampleController {

    @Autowired
    private WeightSampleService weightSampleService;

    // Save a new weight sample
    @PostMapping
    public ResponseEntity<WeightSampleRequest> saveWeightSample(
            @Valid @RequestBody WeightSampleRequest weightSampleRequest
    ) {
        return ResponseEntity.ok(weightSampleService.saveWeightSample(weightSampleRequest));
    }

    // Get all weight samples (paginated)
    @GetMapping
    public ResponseEntity<PageResponse<WeightSampleResponse>> findAllWeightSamples(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(weightSampleService.findAllWeightSamples(page, size));
    }

    // Get a single weight sample by ID
    @GetMapping("/{sample-id}")
    public ResponseEntity<WeightSampleResponse> getWeightSample(@PathVariable("sample-id") Long sampleId) {
        return ResponseEntity.ok(weightSampleService.findById(sampleId));
    }

    // Archive weight sample (soft delete)
    @PutMapping("/archive/{id}")
    public ResponseEntity<?> archiveWeightSample(@PathVariable Long id) {
        weightSampleService.deleteWeightSample(id);
        return ResponseEntity.ok("Weight Sample deleted successfully");
    }
}
