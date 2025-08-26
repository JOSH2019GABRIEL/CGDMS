package com.cgdms.CGDMS.batch;

import com.cgdms.CGDMS.pond.PondRequest;
import com.cgdms.CGDMS.pond.PondService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("batch")
@Tag(name = "Batch")
public class BatchController {


    @Autowired
    private BatchService batchService;

//    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<BatchRequest> savePond (@Valid @RequestBody BatchRequest batchRequest) {
        return ResponseEntity.ok(batchService.saveBatch(batchRequest));
    }
}
