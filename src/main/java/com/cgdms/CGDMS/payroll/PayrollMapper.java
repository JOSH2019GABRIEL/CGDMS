package com.cgdms.CGDMS.payroll;

import com.cgdms.CGDMS.cadre.Cadre;
import com.cgdms.CGDMS.user.User;
import org.springframework.stereotype.Service;

@Service
public class PayrollMapper {

    public Payroll toEntity(PayrollRequest request) {
        Payroll payroll = new Payroll();

        User user = new User();
        user.setId(request.getStaffId());
        payroll.setUser(user);

        Cadre cadre = new Cadre();
        cadre.setId(request.getCadreId());
        payroll.setCadre(cadre);

        payroll.setStartDate(request.getStartDate());
        payroll.setEndDate(request.getEndDate());
        payroll.setDaysWorked(request.getDaysWorked());
        payroll.setHoursWorked(request.getHoursWorked());
        payroll.setDeductions(request.getDeductions());
        payroll.setBonus(request.getBonus());
        return payroll;
    }

    public PayrollResponse toResponse(Payroll payroll) {
        return PayrollResponse.builder()
                .id(payroll.getId())
                .staffName(payroll.getUser() != null ? payroll.getUser().fullName() : null)
                .cadreName(payroll.getCadre() != null ? payroll.getCadre().getCadreName() : null)
                .paymentType(payroll.getCadre() != null ? payroll.getCadre().getPaymentType().name() : null)
                .startDate(payroll.getStartDate())
                .endDate(payroll.getEndDate())
                .daysWorked(payroll.getDaysWorked())
                .hoursWorked(payroll.getHoursWorked())
                .grossPay(payroll.getGrossPay())
                .deductions(payroll.getDeductions())
                .bonus(payroll.getBonus())
                .netPay(payroll.getNetPay())
                .isApproved(payroll.getIsApproved())
                .isPaid(payroll.getIsPaid())
                .paymentReference(payroll.getPaymentReference())
                .build();
    }
}