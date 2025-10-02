package com.cgdms.CGDMS.broiler.flock;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("flocks")
@Tag(name = "Flock")
public class FlockController {

    @Autowired
    private FlockService flockService;

    //    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<FlockRequest> saveFlock (@Valid @RequestBody FlockRequest flockRequest) {
        return ResponseEntity.ok(flockService.saveFlock(flockRequest));
    }

    //    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public ResponseEntity<PageResponse<FlockResponse>> findAllFlock(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(flockService.findAllFlocks(page, size));
    }

    //    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/{flock-id}")
    public ResponseEntity<FlockResponse> getFlock(@PathVariable("flock-id") Long flockId) {
        return ResponseEntity.ok(flockService.findById(flockId));
    }

    @PutMapping("/archive/{id}")
//    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> archiveFlock (@PathVariable Long id) {
        flockService.deleteFlock(id);
        return ResponseEntity.ok("User delete successfully");
    }


}