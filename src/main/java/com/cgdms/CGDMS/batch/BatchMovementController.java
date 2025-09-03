package com.cgdms.CGDMS.batch;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("batch-movements")
@Tag(name = "Batch Movement")
@RequiredArgsConstructor
public class BatchMovementController {

    private final BatchMovementService service;

    @PostMapping
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<BatchMovementResponse> create(@RequestBody @Valid BatchMovementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping("/{id}")
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<BatchMovementResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }


    @GetMapping
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<PageResponse<BatchMovementResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(service.findAll(page, size));
    }


    @GetMapping("/by-batch/{batchId}")
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<PageResponse<BatchMovementResponse>> listByBatch(
            @PathVariable Long batchId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(service.findByBatch(batchId, page, size));
    }
}
