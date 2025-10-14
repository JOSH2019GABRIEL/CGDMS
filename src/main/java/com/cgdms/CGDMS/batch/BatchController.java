package com.cgdms.CGDMS.batch;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("batch")
@Tag(name = "Batch")
public class BatchController {


    @Autowired
    private BatchService batchService;

//    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<BatchRequest> savePond (@Valid @RequestBody BatchRequest batchRequest) {
        return ResponseEntity.ok(batchService.saveBatch(batchRequest));
    }

    @GetMapping
    public ResponseEntity<PageResponse<BatchResponse>> findAllBatch(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(batchService.findAllBatch(page, size));
    }

//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/{batch-id}")
    public ResponseEntity<BatchResponse> getBatch(@PathVariable("batch-id") Long batchId) {
        return ResponseEntity.ok(batchService.findById(batchId));
    }

    @PutMapping("/archive/{id}")
//    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> archiveBatch (@PathVariable Long id) {
        batchService.deleteBatch(id);
        return ResponseEntity.ok("User delete successfully");
    }

    @GetMapping("/get-count")
    public ResponseEntity<Integer> getTotalFingerLings () {
        Integer number = batchService.totalNumberOfFingerlings();
        return ResponseEntity.ok(number);
    }
}
