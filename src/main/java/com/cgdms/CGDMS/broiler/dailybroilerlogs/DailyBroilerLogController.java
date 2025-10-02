package com.cgdms.CGDMS.broiler.dailybroilerlogs;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("daily-flock-log")
@Tag(name = "Daily Flock Log")
public class DailyBroilerLogController {

    @Autowired
    private DailyBroilerLogService dailyBroilerLogService;

    //    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<DailyBroilerLogRequest> saveDailyLog(@Valid @RequestBody DailyBroilerLogRequest dailyBroilerLog) {
        return ResponseEntity.ok(dailyBroilerLogService.saveLog(dailyBroilerLog));
    }

    //    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public ResponseEntity<PageResponse<DailyBroilerLogResponse>> findAllLogs(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(dailyBroilerLogService.findAllLogs(page, size));
    }

    //    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/{flock-id}")
    public ResponseEntity<DailyBroilerLogResponse> getLog(@PathVariable("log-id") Long logId) {
        return ResponseEntity.ok(dailyBroilerLogService.findById(logId));
    }

    @PutMapping("/archive/{id}")
//    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> archiveLog(@PathVariable Long id) {
        dailyBroilerLogService.deleteLog(id);
        return ResponseEntity.ok("Log delete successfully");
    }


}