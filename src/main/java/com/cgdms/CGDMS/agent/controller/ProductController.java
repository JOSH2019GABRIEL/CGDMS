package com.cgdms.CGDMS.agent.controller;

import com.cgdms.CGDMS.agent.entity.request.ProductRequest;
import com.cgdms.CGDMS.agent.entity.response.ProductResponse;
import com.cgdms.CGDMS.agent.service.ProductService;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.fishmanagement.entity.request.FishHarvestRequest;
import com.cgdms.CGDMS.fishmanagement.entity.response.FishHarvestResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("product")
@Tag(name = "Products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductRequest> saveProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.saveProduct(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<ProductResponse>> findAllProduct(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(productService.findAllProducts(page, size));
    }

    @GetMapping("/{product-id}")
    public ResponseEntity<ProductResponse> findProductById(@PathVariable("product-id") Long productId) {
        return ResponseEntity.ok(productService.findProductById(productId));
    }

    @PutMapping("/archived/{id}")
    public ResponseEntity<?> archiveProduct(@PathVariable Long id) {
        productService.deleteProductById(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}
