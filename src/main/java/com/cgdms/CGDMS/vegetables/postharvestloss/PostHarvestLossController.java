package com.cgdms.CGDMS.vegetables.postharvestloss;


import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("postharvest-losses")
@Tag(name = "Post-Harvest Losses")
public class PostHarvestLossController {

    @Autowired
    private PostHarvestLossService postHarvestLossService;

    @PostMapping
    public ResponseEntity<PostharvestLossRequest> saveLoss(@Valid @RequestBody PostharvestLossRequest request) {
        return ResponseEntity.ok(postHarvestLossService.saveLoss(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<PostharvestLossResponse>> findAll(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(postHarvestLossService.findAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostharvestLossResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(postHarvestLossService.findById(id));
    }

    @PutMapping("/archive/{id}")
    public ResponseEntity<String> archive(@PathVariable Long id) {
        postHarvestLossService.delete(id);
        return ResponseEntity.ok("Post-harvest loss archived successfully");
    }
}
