package com.cgdms.CGDMS.vegetables.plots;

import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("plot")
@Tag(name = "Plots")
public class PlotController {

    @Autowired
    private PlotService plotService;

    @PostMapping
    public ResponseEntity<PlotRequest> saveLoss(@Valid @RequestBody PlotRequest request) {
        return ResponseEntity.ok(plotService.savePlot(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<PlotResponse>> findAll(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(plotService.findAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlotResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(plotService.findById(id));
    }

    @PutMapping("/archive/{id}")
    public ResponseEntity<String> archive(@PathVariable Long id) {
        plotService.delete(id);
        return ResponseEntity.ok("Plot deleted successfully");
    }

    @GetMapping("/get-count")
    public ResponseEntity<Integer> getTotalPlots () {
        Integer number = plotService.totalNumberOfPlots();
        return ResponseEntity.ok(number);
    }
}
