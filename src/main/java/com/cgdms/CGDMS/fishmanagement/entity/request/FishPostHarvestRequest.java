package com.cgdms.CGDMS.fishmanagement.entity.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FishPostHarvestRequest {

    private Long id;
    private String destinationType;
    private Double quantityToLiveSaleKg;
    private Double quantityToSmokingKg;
    private String destinationBatchNo;
    private LocalDate transferDate;
    private Long harvestId;

}
