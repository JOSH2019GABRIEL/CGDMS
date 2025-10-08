package com.cgdms.CGDMS.vegetables.harvestBatch;

import com.cgdms.CGDMS.vegetables.plots.Plot;
import org.springframework.stereotype.Service;

@Service
public class HarvestBatchMapper {

    public HarvestBatch toEntity(HarvestBatchRequest request, Plot plot) {
        if (request == null) return null;

        return HarvestBatch.builder()
                .date(request.getDate())
                .harvestedQtyKg(request.getHarvestedQtyKg())
                .marketGrade(request.getMarketGrade())
                .packedQtyKg(request.getPackedQtyKg())
                .packType(request.getPackType())
                .plot(plot)
                .build();
    }

    public HarvestBatchResponse toResponse(HarvestBatch entity) {
        if (entity == null) return null;

        return HarvestBatchResponse.builder()
                .id(entity.getId())
                .date(entity.getDate())
                .harvestedQtyKg(entity.getHarvestedQtyKg())
                .marketGrade(entity.getMarketGrade())
                .packedQtyKg(entity.getPackedQtyKg())
                .packType(entity.getPackType())
                .plotId(entity.getPlot() != null ? entity.getPlot().getId() : null)
                .build();
    }
}