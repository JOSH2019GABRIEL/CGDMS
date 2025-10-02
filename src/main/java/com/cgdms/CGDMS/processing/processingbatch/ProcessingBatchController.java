package com.cgdms.CGDMS.processing.processingbatch;


import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("processing-batches")
@Tag(name = "Processing Batches")
public class ProcessingBatchController {

    @Autowired
    private ProcessingBatchService processingBatchService;

    // Save a new processing batch
    @PostMapping
    public ResponseEntity<ProcessingBatchRequest> saveProcessingBatch(
            @Valid @RequestBody ProcessingBatchRequest processingBatchRequest
    ) {
        return ResponseEntity.ok(processingBatchService.saveProcessingBatch(processingBatchRequest));
    }

    // Get all processing batches (paginated)
    @GetMapping
    public ResponseEntity<PageResponse<ProcessingBatchResponse>> findAllProcessingBatches(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(processingBatchService.findAllProcessingBatches(page, size));
    }

    // Get a single processing batch by ID
    @GetMapping("/{batch-id}")
    public ResponseEntity<ProcessingBatchResponse> getProcessingBatch(@PathVariable("batch-id") Long batchId) {
        return ResponseEntity.ok(processingBatchService.findById(batchId));
    }

    // Archive processing batch (soft delete)
    @PutMapping("/archive/{id}")
    public ResponseEntity<?> archiveProcessingBatch(@PathVariable Long id) {
        processingBatchService.deleteProcessingBatch(id);
        return ResponseEntity.ok("Processing Batch deleted successfully");
    }
}
