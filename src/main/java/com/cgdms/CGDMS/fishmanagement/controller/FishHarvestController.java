package com.cgdms.CGDMS.fishmanagement.controller;


import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.fishmanagement.entity.request.FishHarvestRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.FishHarvestResponse;
import com.cgdms.CGDMS.fishmanagement.service.FishHarvestService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("fish-harvest")
@Tag(name = "Fish Harvest")
@RequiredArgsConstructor
public class FishHarvestController {

    private final FishHarvestService fishHarvestService;

    @PostMapping
    public ResponseEntity<FishHarvestRequest> saveFishHarvest(@Valid @RequestBody FishHarvestRequest request) {
        return ResponseEntity.ok(fishHarvestService.saveFishHarvest(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<FishHarvestResponse>> findAllFishHarvests(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(fishHarvestService.findAllFishHarvest(page, size));
    }

    @GetMapping("/{fish-id}")
    public ResponseEntity<FishHarvestResponse> findFishHarvestById(@PathVariable("fish-id") Long fishHarvestId) {
        return ResponseEntity.ok(fishHarvestService.findFishHarvestById(fishHarvestId));
    }

    @PutMapping("/archived/{id}")
    public ResponseEntity<?> archiveFishHarvest(@PathVariable Long id) {
        fishHarvestService.deleteFishHarvestById(id);
        return ResponseEntity.ok(" Fish Harvest deleted successfully");
    }
}
