package com.cgdms.CGDMS.fishmanagement.entity.request;

import lombok.Data;

@Data
public class LiveSalesRequest {

    private Long id;
    private Long postHarvestId;
    private String buyName;
    private Double salePricePerKg;
    private Double totalSaleValue;
    private String paymentStatus;
    private String invoiceNo;
    private String dispatchMethod;
}
