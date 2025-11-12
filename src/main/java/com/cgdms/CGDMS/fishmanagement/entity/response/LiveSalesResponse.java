package com.cgdms.CGDMS.fishmanagement.entity.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LiveSalesResponse {

    private Long id;
    private Long postHarvestId;
    private String buyName;
    private Double salePricePerKg;
    private Double totalSaleValue;
    private String paymentStatus;
    private String invoiceNo;
    private String dispatchMethod;
}
