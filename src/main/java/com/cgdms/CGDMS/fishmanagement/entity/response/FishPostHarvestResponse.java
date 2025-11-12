package com.cgdms.CGDMS.fishmanagement.entity.response;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class FishPostHarvestResponse {

    private Long id;
    private String destinationType;
    private Double quantityToLiveSaleKg;
    private Double quantityToSmokingKg;
    private String destinationBatchNo;
    private LocalDate transferDate;
    private Long harvestId;

}
