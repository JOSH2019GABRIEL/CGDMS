package com.cgdms.CGDMS.payroll;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class PayrollResponse {
    private Long id;
    private String staffName;
    private String cadreName;
    private String paymentType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer daysWorked;
    private Integer hoursWorked;
    private Double grossPay;
    private Double deductions;
    private Double bonus;
    private Double netPay;
    private Boolean isApproved;
    private Boolean isPaid;
    private String paymentReference;
}