package com.cgdms.CGDMS.logs.env;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("env-logs")
@Tag(name = "Environment Log")
@RequiredArgsConstructor
public class EnvLogController {

    private final EnvLogService service;

    @PostMapping
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<EnvLogResponse> create(@RequestBody @Valid EnvLogRequest request, Authentication connectedUser) {
        return ResponseEntity.ok(service.create(request, connectedUser));
    }

    @PutMapping("/{id}")
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<EnvLogResponse> update(@PathVariable Long id, @RequestBody @Valid EnvLogRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<EnvLogResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<PageResponse<EnvLogResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long pondId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        if (pondId != null && start != null && end != null) {
            return ResponseEntity.ok(service.listByPondAndDateRange(pondId, start, end, page, size));
        } else if (pondId != null) {
            return ResponseEntity.ok(service.listByPond(pondId, page, size));
        } else if (start != null && end != null) {
            return ResponseEntity.ok(service.listByDateRange(start, end, page, size));
        } else {
            return ResponseEntity.ok(service.listAll(page, size));
        }
    }
}