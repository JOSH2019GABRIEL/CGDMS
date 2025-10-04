package com.cgdms.CGDMS.broiler.medication;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("broiler-medication-logs")
@Tag(name = "Broiler Medication Logs")
public class BroilerMedicationLogController {

    @Autowired
    private BroilerMedicationLogService broilerMedicationLogService;

    // Save a new medication log
    @PostMapping
    public ResponseEntity<BroilerMedicationLogRequest> saveMedicationLog(@Valid @RequestBody BroilerMedicationLogRequest medicationLog) {
        return ResponseEntity.ok(broilerMedicationLogService.saveMedication(medicationLog));
    }

    // Get all medication logs (paginated)
    @GetMapping
    public ResponseEntity<PageResponse<BroilerMedicationLogResponse>> findAllMedicationLogs(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(broilerMedicationLogService.findAllMedications(page, size));
    }

    // Get single medication log by id
    @GetMapping("/{log-id}")
    public ResponseEntity<BroilerMedicationLogResponse> getMedicationLog(@PathVariable("log-id") Long logId) {
        return ResponseEntity.ok(broilerMedicationLogService.findById(logId));
    }

    // Archive medication log (soft delete)
    @PutMapping("/archive/{id}")
    public ResponseEntity<?> archiveMedicationLog(@PathVariable Long id) {
        broilerMedicationLogService.deleteMedication(id);
        return ResponseEntity.ok("Medication Log deleted successfully");
    }
}

