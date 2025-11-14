package com.cgdms.CGDMS.agent.controller;


import com.cgdms.CGDMS.agent.entity.request.FulfillmentEventRequest;
import com.cgdms.CGDMS.agent.entity.response.FulfillmentEventResponse;
import com.cgdms.CGDMS.agent.service.FulfilmentEventService;
import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("fulfillment")
@Tag(name = "Fulfillment")
@RequiredArgsConstructor
public class FulfilmentEventController {

    private final FulfilmentEventService fulfilmentEventService;

    @PostMapping
    public ResponseEntity<FulfillmentEventRequest> save( @Valid @RequestBody FulfillmentEventRequest request) {
        return ResponseEntity.ok(fulfilmentEventService.saveFulfilment(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<FulfillmentEventResponse>> findAll(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(fulfilmentEventService.findAllFulfilEvents(page, size));
    }

    @GetMapping("/fulfil-status")
    public ResponseEntity<PageResponse<FulfillmentEventResponse>> findAllByStatus(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            String status
    ) {
        return ResponseEntity.ok(fulfilmentEventService.findAllFulfilEventsByStatus(page, size, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FulfillmentEventResponse> getFulfillmentEventById(@PathVariable("id") Long eventId) {
        return ResponseEntity.ok(fulfilmentEventService.findFulfilmentEventById(eventId));
    }

    @PutMapping("/{id}/processed")
    public ResponseEntity<FulfillmentEventResponse> processFulfilmentEvent(@PathVariable Long id) {
        return ResponseEntity.ok(fulfilmentEventService.updateFulfilmentToProcessingStatus(id));
    }

    @PutMapping("/{id}/dispatched")
    public ResponseEntity<FulfillmentEventResponse> dispatchFulfilmentEvent(@PathVariable Long id) {
        return ResponseEntity.ok(fulfilmentEventService.updateFulfilmentToDispatchStatus(id));
    }

    @PutMapping("/{id}/fulfilled")
    public ResponseEntity<FulfillmentEventResponse> fulfilledFulfilmentEvent(@PathVariable Long id) {
        return ResponseEntity.ok(fulfilmentEventService.updateFulfilmentToFailedStatus(id));
    }

    @PutMapping("/{id}/failed")
    public ResponseEntity<FulfillmentEventResponse> failedFulfilmentEvent(@PathVariable Long id) {
        return ResponseEntity.ok(fulfilmentEventService.updateFulfilmentToFulfilledStatus(id));
    }

    @PutMapping("/archive/{id}")
    public ResponseEntity<?> archiveFulfillmentEvent(@PathVariable Long id) {
        fulfilmentEventService.deleteEventById(id);
        return ResponseEntity.ok("Event delete successfully");
    }

}
