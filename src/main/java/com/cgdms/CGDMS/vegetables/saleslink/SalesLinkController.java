package com.cgdms.CGDMS.vegetables.saleslink;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("sales-links")
@Tag(name = "Sales Links")
public class SalesLinkController {

    @Autowired
    private SalesLinkService salesLinkService;

    @PostMapping
    public ResponseEntity<SalesLinkRequest> saveSalesLink(@Valid @RequestBody SalesLinkRequest request) {
        return ResponseEntity.ok(salesLinkService.saveSalesLink(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<SalesLinkResponse>> findAll(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(salesLinkService.findAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesLinkResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(salesLinkService.findById(id));
    }

    @PutMapping("/archive/{id}")
    public ResponseEntity<String> archive(@PathVariable Long id) {
        salesLinkService.delete(id);
        return ResponseEntity.ok("Sales link archived successfully");
    }
}
