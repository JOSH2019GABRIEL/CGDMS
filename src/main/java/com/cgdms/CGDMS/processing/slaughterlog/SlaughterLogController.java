package com.cgdms.CGDMS.processing.slaughterlog;


import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("slaughter-logs")
@Tag(name = "Slaughter Logs")
public class SlaughterLogController {

    @Autowired
    private SlaughterLogService slaughterLogService;

    // Save a new slaughter log
    @PostMapping
    public ResponseEntity<SlaughterLogRequest> saveSlaughterLog(
            @Valid @RequestBody SlaughterLogRequest slaughterLogRequest
    ) {
        return ResponseEntity.ok(slaughterLogService.saveSlaughterLog(slaughterLogRequest));
    }

    // Get all slaughter logs (paginated)
    @GetMapping
    public ResponseEntity<PageResponse<SlaughterLogResponse>> findAllSlaughterLogs(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(slaughterLogService.findAllSlaughterLogs(page, size));
    }

    // Get a single slaughter log by ID
    @GetMapping("/{log-id}")
    public ResponseEntity<SlaughterLogResponse> getSlaughterLog(@PathVariable("log-id") Long logId) {
        return ResponseEntity.ok(slaughterLogService.findById(logId));
    }

    // Archive slaughter log (soft delete)
    @PutMapping("/archive/{id}")
    public ResponseEntity<?> archiveSlaughterLog(@PathVariable Long id) {
        slaughterLogService.deleteSlaughterLog(id);
        return ResponseEntity.ok("Slaughter Log deleted successfully");
    }
}
