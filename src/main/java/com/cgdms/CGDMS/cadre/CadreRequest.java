package com.cgdms.CGDMS.cadre;

import lombok.Data;

@Data
public class CadreRequest {
    private Long id;
    private String cadreName;
    private PaymentType paymentType;
    private Double rate;
    private String description;
    private Long farmId;
}