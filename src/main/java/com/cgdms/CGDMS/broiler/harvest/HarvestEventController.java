package com.cgdms.CGDMS.broiler.harvest;


import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("harvest-events")
@Tag(name = "Harvest Events")
public class HarvestEventController {

    @Autowired
    private HarvestEventService harvestEventService;

    // Save new harvest event
    @PostMapping
    public ResponseEntity<HarvestEventRequest> saveHarvestEvent(@Valid @RequestBody HarvestEventRequest harvestEvent) {
        return ResponseEntity.ok(harvestEventService.saveHarvest(harvestEvent));
    }

    @GetMapping
    public ResponseEntity<PageResponse<HarvestEventResponse>> findAllHarvestEvents(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(harvestEventService.findAllHarvests(page, size));
    }

    @GetMapping("/{event-id}")
    public ResponseEntity<HarvestEventResponse> getHarvestEvent(@PathVariable("event-id") Long eventId) {
        return ResponseEntity.ok(harvestEventService.findById(eventId));
    }

    // Archive harvest event (soft delete)
    @PutMapping("/archive/{id}")
    public ResponseEntity<?> archiveHarvestEvent(@PathVariable Long id) {
        harvestEventService.deleteHarvest(id);
        return ResponseEntity.ok("Harvest Event deleted successfully");
    }
}
