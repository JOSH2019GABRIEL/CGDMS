package com.cgdms.CGDMS.fishmanagement.controller;

import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.fishmanagement.entity.request.LiveSalesRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.LiveSalesResponse;
import com.cgdms.CGDMS.fishmanagement.service.LiveSalesDetailsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("fish-live-sales")
@Tag(name = "Fish LiveSales")
@RequiredArgsConstructor
public class LiveSalesDetailsController {

    private final LiveSalesDetailsService liveSalesDetailsService;

    @PostMapping
    public ResponseEntity<LiveSalesRequest> saveFishLiveSales(@Valid @RequestBody LiveSalesRequest request) {
        return ResponseEntity.ok(liveSalesDetailsService.saveFishSales(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<LiveSalesResponse>> findAllFishLiveSales(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(liveSalesDetailsService.findAllLiveSalesDetails(page, size));
    }

    @GetMapping("/{salesId}")
    public ResponseEntity<LiveSalesResponse> findFishLiveSaleById(@PathVariable Long salesId) {
        return ResponseEntity.ok(liveSalesDetailsService.findLiveSalesDetailById(salesId));
    }

    @PutMapping("/archived/{id}")
    public ResponseEntity<?> archiveFishLiveSale(@PathVariable Long id) {
        liveSalesDetailsService.deleteLiveSalesDetailById(id);
        return ResponseEntity.ok("Fish LiveSale deleted successfully");
    }

}
