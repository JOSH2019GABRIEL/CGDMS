package com.cgdms.CGDMS.vegetables.crop;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CropVarietyResponse {
    private Long id;
    private String cropName;
    private String variety;
    private Double seedRateGPerM2;
    private Integer expectedDaysToHarvest;
    private Integer greenhouseDaysAdjustment;
    private String spacing;
}
