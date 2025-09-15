package com.cgdms.CGDMS.logs.feed;


import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("feed-logs")
@Tag(name = "Feed Log")
@RequiredArgsConstructor
public class FeedLogController {

    private final FeedLogService service;

    @PostMapping
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<FeedLogResponse> create(@RequestBody @Valid FeedLogRequest request) {
        FeedLogResponse resp = service.create(request);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/{id}")
//    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<FeedLogResponse> update(@PathVariable Long id, @RequestBody @Valid FeedLogRequest request) {
        FeedLogResponse resp = service.update(id, request);
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long feedLodId) {
        service.deleteFeedLog(feedLodId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<FeedLogResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<PageResponse<FeedLogResponse>> findAllFeedLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
//            @RequestParam(required = false) Long pondId,
//            @RequestParam(required = false) Long batchId,
//            @RequestParam(required = false) String startDate, // yyyy-MM-dd
//            @RequestParam(required = false) String endDate
    ) {

        return ResponseEntity.ok(service.findAll(page, size));
    }
}