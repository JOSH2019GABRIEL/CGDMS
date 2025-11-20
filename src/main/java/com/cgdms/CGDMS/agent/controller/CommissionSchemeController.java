package com.cgdms.CGDMS.agent.controller;


import com.cgdms.CGDMS.agent.entity.request.CommissionSchemeRequest;
import com.cgdms.CGDMS.agent.entity.response.CommissionSchemeResponse;
import com.cgdms.CGDMS.agent.entity.response.OrderResponse;
import com.cgdms.CGDMS.agent.service.CommisionSchemeService;
import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("commission-scheme")
@Tag(name = "Commission Scheme")
@RequiredArgsConstructor
public class CommissionSchemeController {

    private final CommisionSchemeService commisionSchemeService;


    @PostMapping
    public ResponseEntity<CommissionSchemeResponse> saveCommissionScheme(@Valid @RequestBody CommissionSchemeRequest request) throws BadRequestException {
        return ResponseEntity.ok(commisionSchemeService.createScheme(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommissionSchemeResponse> updateCommissionScheme(@Valid @RequestBody CommissionSchemeRequest request) throws BadRequestException {
        return ResponseEntity.ok(commisionSchemeService.updateScheme(request.getId(), request));
    }

    @GetMapping("/{com-id}")
    public ResponseEntity<CommissionSchemeResponse> getOrderById(@PathVariable("com-id") Long comId) {
        return ResponseEntity.ok(commisionSchemeService.getById(comId));
    }

    @GetMapping
    public ResponseEntity<PageResponse<CommissionSchemeResponse>> findAllCommissionScheme(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(commisionSchemeService.findAllScheme(page, size));
    }

    @PutMapping("/archive/{id}")
    public ResponseEntity<?> archiveCommissionScheme(@PathVariable Long id) {
        commisionSchemeService.delete(id);
        return ResponseEntity.ok("Scheme delete successfully");
    }

}
