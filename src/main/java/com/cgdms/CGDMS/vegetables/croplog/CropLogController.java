package com.cgdms.CGDMS.vegetables.croplog;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("crop-logs")
@Tag(name = "Crop Logs")
public class CropLogController {

    @Autowired
    private CropLogService cropLogService;

    @PostMapping
    public ResponseEntity<CropLogRequest> saveCropLog(@Valid @RequestBody CropLogRequest request) {
        return ResponseEntity.ok(cropLogService.saveCropLog(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<CropLogResponse>> findAll(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(cropLogService.findAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CropLogResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(cropLogService.findById(id));
    }

    @PutMapping("/archive/{id}")
    public ResponseEntity<String> archive(@PathVariable Long id) {
        cropLogService.delete(id);
        return ResponseEntity.ok("Crop log archived successfully");
    }
}
