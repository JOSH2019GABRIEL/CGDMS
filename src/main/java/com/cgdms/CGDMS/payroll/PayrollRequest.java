package com.cgdms.CGDMS.payroll;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PayrollRequest {
    private Integer staffId;
    private Long cadreId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer daysWorked;
    private Integer hoursWorked;
    private Double deductions;
    private Double bonus;
}