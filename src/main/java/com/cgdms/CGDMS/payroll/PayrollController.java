package com.cgdms.CGDMS.payroll;


import com.cgdms.CGDMS.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("payroll")
@Tag(name = "Payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping
    public ResponseEntity<PayrollResponse> createPayroll(@RequestBody PayrollRequest request) {
        return ResponseEntity.ok(payrollService.createPayroll(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<PayrollResponse>> getAllPayrolls(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(payrollService.getAllPayrolls(page, size));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<PayrollResponse> approve(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.approvePayroll(id));
    }

    @PutMapping("/{id}/mark-paid")
    public ResponseEntity<PayrollResponse> markPaid(
            @PathVariable Long id,
            @RequestParam String reference) {
        return ResponseEntity.ok(payrollService.markAsPaid(id, reference));
    }
}