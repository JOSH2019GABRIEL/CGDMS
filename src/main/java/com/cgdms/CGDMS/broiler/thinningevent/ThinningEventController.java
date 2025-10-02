package com.cgdms.CGDMS.broiler.thinningevent;


import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("thinning-events")
@Tag(name = "Thinning Events")
public class ThinningEventController {

    @Autowired
    private ThinningEventService thinningEventService;

    // Save a new thinning event
    @PostMapping
    public ResponseEntity<ThinningEventRequest> saveThinningEvent(@Valid @RequestBody ThinningEventRequest thinningEvent) {
        return ResponseEntity.ok(thinningEventService.saveThinningEvent(thinningEvent));
    }

    // Get all thinning events (paginated)
    @GetMapping
    public ResponseEntity<PageResponse<ThinningEventResponse>> findAllThinningEvents(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(thinningEventService.findAllThinningEvents(page, size));
    }

    // Get a single thinning event by ID
    @GetMapping("/{event-id}")
    public ResponseEntity<ThinningEventResponse> getThinningEvent(@PathVariable("event-id") Long eventId) {
        return ResponseEntity.ok(thinningEventService.findById(eventId));
    }

    // Archive thinning event (soft delete)
    @PutMapping("/archive/{id}")
    public ResponseEntity<?> archiveThinningEvent(@PathVariable Long id) {
        thinningEventService.deleteThinningEvent(id);
        return ResponseEntity.ok("Thinning Event deleted successfully");
    }
}