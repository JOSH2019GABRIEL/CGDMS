package com.cgdms.CGDMS.vegetables.crop;


import com.cgdms.CGDMS.base.BaseEntity;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class CropVariety extends BaseEntity {
    private String cropName;
    private String variety;
    private Double seedRateGPerM2;
    private Integer expectedDaysToHarvest;
    private Integer greenhouseDaysAdjustment;
    private String spacing;
}