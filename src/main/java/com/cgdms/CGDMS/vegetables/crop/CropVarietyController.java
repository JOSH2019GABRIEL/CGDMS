package com.cgdms.CGDMS.vegetables.crop;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("crop-varieties")
@Tag(name = "Crop Varieties")
public class CropVarietyController {

    @Autowired
    private CropVarietyService cropVarietyService;

    @PostMapping
    public ResponseEntity<CropVarietyRequest> saveCropVariety(@Valid @RequestBody CropVarietyRequest request) {
        return ResponseEntity.ok(cropVarietyService.saveCropVariety(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<CropVarietyResponse>> findAll(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(cropVarietyService.findAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CropVarietyResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(cropVarietyService.findById(id));
    }

    @PutMapping("/archive/{id}")
    public ResponseEntity<String> archive(@PathVariable Long id) {
        cropVarietyService.delete(id);
        return ResponseEntity.ok("Crop Variety deleted successfully");
    }

}