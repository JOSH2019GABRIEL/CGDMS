package com.cgdms.CGDMS.vegetables.plots;


import org.springframework.stereotype.Service;

@Service
public class PlotMapper {

    public Plot toEntity(PlotRequest request) {
        if (request == null) return null;

        return Plot.builder()
                .type(request.getType())
                .areaM2(request.getAreaM2())
                .soilType(request.getSoilType())
                .bedLayout(request.getBedLayout())
                .build();
    }

    public PlotResponse toResponse(Plot entity) {
        if (entity == null) return null;

        return PlotResponse.builder()
                .id(entity.getId())
                .type(entity.getType())
                .areaM2(entity.getAreaM2())
                .soilType(entity.getSoilType())
                .bedLayout(entity.getBedLayout())
                .build();
    }
}
