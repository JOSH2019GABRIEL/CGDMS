package com.cgdms.CGDMS.logs.medication;


import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("medication-logs")
@Tag(name = "Medication Log")
@RequiredArgsConstructor
public class MedicationLogController {

    private final MedicationLogService service;

    @PostMapping
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<MedicationLogResponse> create(@RequestBody @Valid MedicationLogRequest request) {
        var resp = service.create(request);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MedicationLogResponse> update(@PathVariable Long id, @RequestBody @Valid MedicationLogRequest request) {
        var resp = service.update(id, request);
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<MedicationLogResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<PageResponse<MedicationLogResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long pondId,
            @RequestParam(required = false) Long batchId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String diagnosis,
            @RequestParam(required = false) String medication
    ) {
        if (pondId != null) {
            return ResponseEntity.ok(service.listByPond(pondId, page, size));
        } else if (batchId != null) {
            return ResponseEntity.ok(service.listByBatch(batchId, page, size));
        } else if (startDate != null && endDate != null) {
            return ResponseEntity.ok(service.listByDateRange(startDate, endDate, page, size));
        } else if (diagnosis != null) {
            return ResponseEntity.ok(service.searchByDiagnosis(diagnosis, page, size));
        } else if (medication != null) {
            return ResponseEntity.ok(service.searchByMedication(medication, page, size));
        } else {
            return ResponseEntity.ok(service.listAll(page, size));
        }
    }
}