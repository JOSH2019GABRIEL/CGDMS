package com.cgdms.CGDMS.cadre;

import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.farm.FarmResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("cadres")
@Tag(name = "Cadre")
@RequiredArgsConstructor
public class CadreController {

    private final CadreService cadreService;

    @PostMapping
    public ResponseEntity<CadreRequest> createCadre(@RequestBody CadreRequest request) {
        return ResponseEntity.ok(cadreService.createCadre(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<CadreResponse>> getAllCadres(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(cadreService.getAllCadres(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CadreResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(cadreService.getById(id));
    }

    // 🧮 Compute pay for given cadre dynamically
    @GetMapping("/{id}/calculate-pay")
    public ResponseEntity<Double> calculatePay(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "0") int hoursWorked,
            @RequestParam(required = false, defaultValue = "0") int daysWorked) {
        return ResponseEntity.ok(cadreService.calculatePay(id, hoursWorked, daysWorked));
    }

    @PutMapping("/archive/{id}")
//    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> archivePond (@PathVariable Long id) {
        cadreService.deleteCadre(id);
        return ResponseEntity.ok("Cadre delete successfully");
    }
}
