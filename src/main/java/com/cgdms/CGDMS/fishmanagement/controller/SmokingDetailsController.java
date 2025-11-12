package com.cgdms.CGDMS.fishmanagement.controller;


import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.fishmanagement.entity.request.SmokingPlantTransferRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.SmokingPlantTransferResponse;
import com.cgdms.CGDMS.fishmanagement.service.SmokingPlantTransferService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("smoking-plant")
@Tag(name = "Smoking Plant")
@RequiredArgsConstructor
public class SmokingDetailsController {

    private final SmokingPlantTransferService smokingPlantTransferService;

    @PostMapping
    public ResponseEntity<SmokingPlantTransferRequest> saveSmokePlant(@Valid @RequestBody SmokingPlantTransferRequest request) {
        return ResponseEntity.ok(smokingPlantTransferService.saveSmokingTransfer(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<SmokingPlantTransferResponse>> findAllSmokePlants(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(smokingPlantTransferService.findAllSmokingPlants(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SmokingPlantTransferResponse> findSmokePlantById(@PathVariable Long id) {
        return ResponseEntity.ok(smokingPlantTransferService.findSmokingPlantsById(id));
    }

    @PutMapping("/archived/{id}")
    public ResponseEntity<?> archiveSmokeTransfer(@PathVariable Long id) {
        smokingPlantTransferService.deleteSmokePlantById(id);
        return ResponseEntity.ok(" Fish Harvest deleted successfully");
    }
}
