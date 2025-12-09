package com.cgdms.CGDMS.fishmanagement.entity.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class FishHarvestResponse {

    private Long id;
    private String pondName;
//    private Long batchNumber;

    private LocalDate harvestDate;
    private String harvestOfficer;
    private String productionCycle;

    private Integer totalFishHarvested;
    private Double averageWeightKg;
    private Double totalWeightKg;
    private Double mortalityDuringHarvest;
    private String gradingCategory;
    private String harvestBatchId;
}
