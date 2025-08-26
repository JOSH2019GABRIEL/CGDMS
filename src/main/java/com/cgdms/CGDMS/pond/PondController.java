package com.cgdms.CGDMS.pond;

import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.UserResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("ponds")
@Tag(name = "Pond")
public class PondController {

    @Autowired
    private PondService pondService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PondRequest> savePond (@Valid @RequestBody PondRequest pondRequest) {
        return ResponseEntity.ok(pondService.savePond(pondRequest));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public ResponseEntity<PageResponse<PondResponse>> findAllPond(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(pondService.findAllPond(page, size));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/{pond-id}")
    public ResponseEntity<PondResponse> getPond(@PathVariable("pond-id") Long pondId) {
        return ResponseEntity.ok(pondService.findById(pondId));
    }

    @PutMapping("/archive/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> archivePond (@PathVariable Long id) {
        pondService.deletePond(id);
        return ResponseEntity.ok("User delete successfully");
    }

}
