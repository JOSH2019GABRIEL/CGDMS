package com.cgdms.CGDMS.vegetables.crop;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CropVarietyRequest {

    private Long id;
    private String cropName;
    private String variety;
    private Double seedRateGPerM2;
    private Integer expectedDaysToHarvest;
    private Integer greenhouseDaysAdjustment;
    private String spacing;
}
