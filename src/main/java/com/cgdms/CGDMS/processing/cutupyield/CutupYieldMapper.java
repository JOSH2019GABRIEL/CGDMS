package com.cgdms.CGDMS.processing.cutupyield;

import com.cgdms.CGDMS.processing.processingbatch.ProcessingBatch;
import org.springframework.stereotype.Service;

@Service
public class CutupYieldMapper {
    public CutupYield toEntity(CutupYieldRequest request, ProcessingBatch processingBatch) {
        if (request == null) return null;

        return CutupYield.builder()
                .wholeBirdsCount(request.getWholeBirdsCount())
                .breastKg(request.getBreastKg())
                .thighKg(request.getThighKg())
                .wingKg(request.getWingKg())
                .drumstickKg(request.getDrumstickKg())
                .carcassKg(request.getCarcassKg())
                .processingBatch(processingBatch)
                .build();
    }

    public CutupYieldResponse toResponse(CutupYield entity) {
        if (entity == null) return null;

        return CutupYieldResponse.builder()
                .id(entity.getId())
                .wholeBirdsCount(entity.getWholeBirdsCount())
                .breastKg(entity.getBreastKg())
                .thighKg(entity.getThighKg())
                .wingKg(entity.getWingKg())
                .drumstickKg(entity.getDrumstickKg())
                .carcassKg(entity.getCarcassKg())
//                .processId(entity.getProcessingBatch() != null ? entity.getProcessingBatch().getId() : null)
//                .plantLocation(entity.getProcessingBatch() != null ? entity.getProcessingBatch().getPlantLocation() : null)
//                .operator(entity.getProcessingBatch() != null ? entity.getProcessingBatch().getOperator() : null)
                .build();
    }
}