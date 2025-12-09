package com.cgdms.CGDMS.fishmanagement.controller;

import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.fishmanagement.entity.request.NominalLossRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.NominalLossResponse;
import com.cgdms.CGDMS.fishmanagement.service.NominalLossService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("nominal-loss")
@Tag(name = "Nominal Loss")
@RequiredArgsConstructor
public class NominalLossController {

    private final NominalLossService nominalLossService;

    @PostMapping
    public ResponseEntity<NominalLossRequest> saveNominalLoss(@Valid @RequestBody NominalLossRequest request) {
        return ResponseEntity.ok(nominalLossService.saveNominalLoss(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<NominalLossResponse>> getAllNominalLoss(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size) {
        return ResponseEntity.ok(nominalLossService.findAllNominalLoss(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NominalLossResponse> getNominalLossById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(nominalLossService.getNominalLoss(id));
    }

    @PutMapping("/archived/{id}")
    public ResponseEntity<?> archiveNominalLoss(@PathVariable("id") Long id) {
        nominalLossService.deleteNominalLoss(id);
        return ResponseEntity.ok("Nominal Loss deleted successfully");
    }
}
