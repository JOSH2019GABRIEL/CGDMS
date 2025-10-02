package com.cgdms.CGDMS.broiler.vaccination;


import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("vaccination-logs")
@Tag(name = "Vaccination Logs")
public class VaccinationLogController {

    @Autowired
    private VaccinationLogService vaccinationLogService;

    // Save a new vaccination log
    @PostMapping
    public ResponseEntity<VaccinationLogRequest> saveVaccinationLog(
            @Valid @RequestBody VaccinationLogRequest vaccinationLog
    ) {
        return ResponseEntity.ok(vaccinationLogService.saveVaccinationLog(vaccinationLog));
    }

    // Get all vaccination logs (paginated)
    @GetMapping
    public ResponseEntity<PageResponse<VaccinationLogResponse>> findAllVaccinationLogs(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(vaccinationLogService.findAllVaccinationLogs(page, size));
    }

    // Get a single vaccination log by ID
    @GetMapping("/{log-id}")
    public ResponseEntity<VaccinationLogResponse> getVaccinationLog(@PathVariable("log-id") Long logId) {
        return ResponseEntity.ok(vaccinationLogService.findById(logId));
    }

    // Archive vaccination log (soft delete)
    @PutMapping("/archive/{id}")
    public ResponseEntity<?> archiveVaccinationLog(@PathVariable Long id) {
        vaccinationLogService.deleteVaccinationLog(id);
        return ResponseEntity.ok("Vaccination Log deleted successfully");
    }
}
