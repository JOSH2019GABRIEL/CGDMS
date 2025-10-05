package com.cgdms.CGDMS.cadre;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CadreResponse {
    private Long id;
    private String cadreName;
    private PaymentType paymentType;
    private Double rate;
    private String description;
    private Long farmId;
    private String farmName;

    // Derived values for easy display in payroll or UI
    private Double estimatedDailyPay;
    private Double estimatedMonthlyPay;
}