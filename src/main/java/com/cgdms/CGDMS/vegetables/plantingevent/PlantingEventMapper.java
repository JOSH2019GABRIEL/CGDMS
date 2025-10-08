package com.cgdms.CGDMS.vegetables.plantingevent;

import com.cgdms.CGDMS.vegetables.crop.CropVariety;
import com.cgdms.CGDMS.vegetables.plots.Plot;
import org.springframework.stereotype.Service;

@Service
public class PlantingEventMapper {

    public PlantingEvent toEntity(PlantingEventRequest request, Plot plot, CropVariety crop) {
        if (request == null) return null;

        return PlantingEvent.builder()
                .date(request.getDate())
                .seedBatch(request.getSeedBatch())
                .seedCount(request.getSeedCount())
                .expectedHarvestDate(request.getExpectedHarvestDate())
                .plot(plot)
                .crop(crop)
                .build();
    }

    public PlantingEventResponse toResponse(PlantingEvent entity) {
        if (entity == null) return null;

        return PlantingEventResponse.builder()
                .id(entity.getId())
                .date(entity.getDate())
                .seedBatch(entity.getSeedBatch())
                .seedCount(entity.getSeedCount())
                .expectedHarvestDate(entity.getExpectedHarvestDate())
                .plotId(entity.getPlot() != null ? entity.getPlot().getId() : null)
                .cropId(entity.getCrop() != null ? entity.getCrop().getId() : null)
                .build();
    }
}