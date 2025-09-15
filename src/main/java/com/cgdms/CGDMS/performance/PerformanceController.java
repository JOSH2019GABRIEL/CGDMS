package com.cgdms.CGDMS.performance;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("fish-performance")
@Tag(name = "Fish Performance")
@RequiredArgsConstructor
public class PerformanceController {

    private final PerformanceService performanceService;

    @PostMapping
    public ResponseEntity<PerformanceResponse> create(@RequestBody PerformanceRequest request) {
        return ResponseEntity.ok(performanceService.createPerformance(request));
    }

    // ✅ Pageable endpoint
    @GetMapping
    public ResponseEntity<Page<PerformanceResponse>> getAll(Pageable pageable) {
        return ResponseEntity.ok(performanceService.getAllPerformances(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PerformanceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(performanceService.getPerformanceById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        performanceService.deletePerformance(id);
        return ResponseEntity.noContent().build();
    }
}
