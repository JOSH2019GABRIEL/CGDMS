package com.cgdms.CGDMS.vegetables.croplog;

import com.cgdms.CGDMS.vegetables.plots.Plot;
import org.springframework.stereotype.Service;

@Service
public class CropLogMapper {

    public CropLog toEntity(CropLogRequest request, Plot plot) {
        if (request == null) return null;

        return CropLog.builder()
                .date(request.getDate())
                .cropStage(request.getCropStage())
                .irrigationL(request.getIrrigationL())
                .fertilizerG(request.getFertilizerG())
                .pesticideApplied(request.getPesticideApplied())
                .plot(plot)
//                .staff(staff)
                .build();
    }

    public CropLogResponse toResponse(CropLog entity) {
        if (entity == null) return null;

        return CropLogResponse.builder()
                .id(entity.getId())
                .date(entity.getDate())
                .cropStage(entity.getCropStage())
                .irrigationL(entity.getIrrigationL())
                .fertilizerG(entity.getFertilizerG())
                .pesticideApplied(entity.getPesticideApplied())
                .plotId(entity.getPlot() != null ? entity.getPlot().getId() : null)
//                .staffId(entity.getStaff() != null ? entity.getStaff().getId() : null)
                .build();
    }
}