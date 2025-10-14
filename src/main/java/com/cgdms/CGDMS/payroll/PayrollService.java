package com.cgdms.CGDMS.payroll;

import com.cgdms.CGDMS.cadre.Cadre;
import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final PayrollMapper mapper;
    private final AuthUtils authUtils;

    @Transactional
    public PayrollResponse createPayroll(PayrollRequest request) {
        Payroll payroll = mapper.toEntity(request);

        User user = payroll.getUser();
        Cadre cadre = payroll.getCadre();

        // --- Compute gross pay based on Cadre payment type ---
        double grossPay = switch (cadre.getPaymentType()) {
            case HOURLY -> cadre.getRate() * request.getHoursWorked();
            case DAILY -> cadre.getRate() * request.getDaysWorked();
            case MONTHLY -> cadre.getRate();
        };

        double deductions = request.getDeductions() != null ? request.getDeductions() : 0.0;
        double bonus = request.getBonus() != null ? request.getBonus() : 0.0;
        double netPay = grossPay + bonus - deductions;

        payroll.setGrossPay(grossPay);
        payroll.setNetPay(netPay);
        payroll.setIsApproved(false);
        payroll.setIsPaid(false);

        Payroll saved = payrollRepository.save(payroll);
        return mapper.toResponse(saved);
    }

    public PageResponse<PayrollResponse> getAllPayrolls(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Payroll> payrolls = payrollRepository.findAll(pageable);

        var responses = payrolls.stream().map(mapper::toResponse).toList();

        return new PageResponse<>(
                responses,
                payrolls.getNumber(),
                payrolls.getSize(),
                payrolls.getTotalElements(),
                payrolls.getTotalPages(),
                payrolls.isFirst(),
                payrolls.isLast()
        );
    }

    public PayrollResponse approvePayroll(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found"));
        payroll.setIsApproved(true);
        return mapper.toResponse(payrollRepository.save(payroll));
    }

    public PayrollResponse markAsPaid(Long id, String reference) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found"));
        payroll.setIsPaid(true);
        payroll.setPaymentReference(reference);
        return mapper.toResponse(payrollRepository.save(payroll));
    }
}