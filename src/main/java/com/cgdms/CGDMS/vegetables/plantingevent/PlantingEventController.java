package com.cgdms.CGDMS.vegetables.plantingevent;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("planting-events")
@Tag(name = "Planting Events")
public class PlantingEventController {

    @Autowired
    private PlantingEventService plantingEventService;

    @PostMapping
    public ResponseEntity<PlantingEventRequest> savePlantingEvent(@Valid @RequestBody PlantingEventRequest request) {
        return ResponseEntity.ok(plantingEventService.saveEvent(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<PlantingEventResponse>> findAll(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(plantingEventService.findAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlantingEventResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(plantingEventService.findById(id));
    }

    @PutMapping("/archive/{id}")
    public ResponseEntity<String> archive(@PathVariable Long id) {
        plantingEventService.delete(id);
        return ResponseEntity.ok("Planting event deleted successfully");
    }
}