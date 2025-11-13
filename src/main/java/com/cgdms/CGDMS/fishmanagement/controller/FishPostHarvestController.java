package com.cgdms.CGDMS.fishmanagement.controller;

import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.fishmanagement.entity.request.FishPostHarvestRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.FishPostHarvestResponse;
import com.cgdms.CGDMS.fishmanagement.service.FishPostHarvestService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("fish-post-harvest")
@Tag(name = "Fish Post Harvest")
@RequiredArgsConstructor
public class FishPostHarvestController {

    private final FishPostHarvestService fishPostHarvestService;

    @PostMapping
    public ResponseEntity<FishPostHarvestRequest> saveFishPostHarvest(@Valid @RequestBody FishPostHarvestRequest request) {
        return ResponseEntity.ok(fishPostHarvestService.saveFishPostHarvest(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<FishPostHarvestResponse>> findAllFishPostHarvests(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(fishPostHarvestService.findAllFishPostHarvest(page, size));
    }

    @GetMapping("/{fishPostHarvestId}")
    public ResponseEntity<FishPostHarvestResponse> findFishPostHarvestById(@PathVariable("fishPostHarvestId") Long fishPostHarvestId) {
        return ResponseEntity.ok(fishPostHarvestService.findFishHarvestById(fishPostHarvestId));
    }

    @PutMapping("/archived/{id}")
    public ResponseEntity<?> archiveFishPostHarvest(@PathVariable Long id) {
        fishPostHarvestService.deleteFishHarvestById(id);
        return ResponseEntity.ok("Fish Post Harvest deleted successfully");
    }

}
