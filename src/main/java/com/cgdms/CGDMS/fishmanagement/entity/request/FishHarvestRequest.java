package com.cgdms.CGDMS.fishmanagement.entity.request;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class FishHarvestRequest {

    private Long id;
    private Long batchId;
    private Long pondId;

    private LocalDate harvestDate;
    private String harvestOfficer;
    private String productionCycle;

    private Integer totalFishHarvested;
    private Double averageWeightKg;
    private Double totalWeightKg;
    private Double mortalityDuringHarvest;
    private String gradingCategory;
}