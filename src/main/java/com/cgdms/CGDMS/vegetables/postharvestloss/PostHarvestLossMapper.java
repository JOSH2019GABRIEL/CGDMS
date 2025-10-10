package com.cgdms.CGDMS.vegetables.postharvestloss;

import com.cgdms.CGDMS.vegetables.harvestBatch.HarvestBatch;
import org.springframework.stereotype.Service;

@Service
public class PostHarvestLossMapper {

    public PostharvestLoss toEntity(PostharvestLossRequest request, HarvestBatch harvest) {
        if (request == null) return null;

        return PostharvestLoss.builder()
                .spoilageKg(request.getSpoilageKg())
                .trimmingWasteKg(request.getTrimmingWasteKg())
                .pestsDamageKg(request.getPestsDamageKg())
                .harvest(harvest)
                .build();
    }

    public PostharvestLossResponse toResponse(PostharvestLoss entity) {
        if (entity == null) return null;

        return PostharvestLossResponse.builder()
                .id(entity.getId())
                .spoilageKg(entity.getSpoilageKg())
                .trimmingWasteKg(entity.getTrimmingWasteKg())
                .pestsDamageKg(entity.getPestsDamageKg())
                .harvestBatchId(entity.getHarvest() != null ? entity.getHarvest().getId() : null)
                .build();
    }
}