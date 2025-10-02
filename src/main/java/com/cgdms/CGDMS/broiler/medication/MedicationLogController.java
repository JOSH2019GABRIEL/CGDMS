package com.cgdms.CGDMS.broiler.medication;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("medication-logs")
@Tag(name = "Medication Logs")
public class MedicationLogController {

    @Autowired
    private MedicationLogService medicationLogService;

    // Save a new medication log
    @PostMapping
    public ResponseEntity<MedicationLogRequest> saveMedicationLog(@Valid @RequestBody MedicationLogRequest medicationLog) {
        return ResponseEntity.ok(medicationLogService.saveMedication(medicationLog));
    }

    // Get all medication logs (paginated)
    @GetMapping
    public ResponseEntity<PageResponse<MedicationLogResponse>> findAllMedicationLogs(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(medicationLogService.findAllMedications(page, size));
    }

    // Get single medication log by id
    @GetMapping("/{log-id}")
    public ResponseEntity<MedicationLogResponse> getMedicationLog(@PathVariable("log-id") Long logId) {
        return ResponseEntity.ok(medicationLogService.findById(logId));
    }

    // Archive medication log (soft delete)
    @PutMapping("/archive/{id}")
    public ResponseEntity<?> archiveMedicationLog(@PathVariable Long id) {
        medicationLogService.deleteMedication(id);
        return ResponseEntity.ok("Medication Log deleted successfully");
    }
}

