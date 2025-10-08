package com.cgdms.CGDMS.processing.processingbatch;

import com.cgdms.CGDMS.broiler.harvest.HarvestEvent;
import org.springframework.stereotype.Service;

@Service
public class ProcessingBatchMapper {
    public ProcessingBatch toEntity(ProcessingBatchRequest request, HarvestEvent harvestEvent) {
        if (request == null) return null;

        return ProcessingBatch.builder()
                .date(request.getDate())
                .plantLocation(request.getPlantLocation())
                .harvestEvent(harvestEvent)
                .build();
    }

    public ProcessingBatchResponse toResponse(ProcessingBatch entity) {
        if (entity == null) return null;

        return ProcessingBatchResponse.builder()
                .id(entity.getId())
                .date(entity.getDate())
                .plantLocation(entity.getPlantLocation())
                .harvestEventId(entity.getHarvestEvent() != null ? entity.getHarvestEvent().getId() : null)
                .build();
    }
}