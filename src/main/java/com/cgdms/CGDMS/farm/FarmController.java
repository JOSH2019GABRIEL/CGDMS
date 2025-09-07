package com.cgdms.CGDMS.farm;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("farms")
@Tag(name = "Farms")
@RequiredArgsConstructor
public class FarmController {

    private final FarmService farmService;

    @PostMapping
    public ResponseEntity<FarmResponse> create(@RequestBody FarmRequest request) {
        return ResponseEntity.ok(farmService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<FarmResponse>> getAll() {
        return ResponseEntity.ok(farmService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FarmResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(farmService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FarmResponse> update(@PathVariable Long id,
                                               @RequestBody FarmRequest request) {
        return ResponseEntity.ok(farmService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        farmService.delete(id);
        return ResponseEntity.noContent().build();
    }
}