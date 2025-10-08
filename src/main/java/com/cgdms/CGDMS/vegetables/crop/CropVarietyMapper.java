package com.cgdms.CGDMS.vegetables.crop;

import org.springframework.stereotype.Service;

@Service
public class CropVarietyMapper {

    public CropVariety toEntity(CropVarietyRequest request) {
        if (request == null) return null;

        return CropVariety.builder()
                .cropName(request.getCropName())
                .variety(request.getVariety())
                .seedRateGPerM2(request.getSeedRateGPerM2())
                .expectedDaysToHarvest(request.getExpectedDaysToHarvest())
                .greenhouseDaysAdjustment(request.getGreenhouseDaysAdjustment())
                .spacing(request.getSpacing())
                .build();
    }

    public CropVarietyResponse toResponse(CropVariety entity) {
        if (entity == null) return null;

        return CropVarietyResponse.builder()
                .id(entity.getId())
                .cropName(entity.getCropName())
                .variety(entity.getVariety())
                .seedRateGPerM2(entity.getSeedRateGPerM2())
                .expectedDaysToHarvest(entity.getExpectedDaysToHarvest())
                .greenhouseDaysAdjustment(entity.getGreenhouseDaysAdjustment())
                .spacing(entity.getSpacing())
                .build();
    }
}