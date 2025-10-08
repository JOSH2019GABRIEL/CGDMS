package com.cgdms.CGDMS.processing.byproduct;

import com.cgdms.CGDMS.processing.processingbatch.ProcessingBatch;
import org.springframework.stereotype.Service;

@Service
public class ByproductMapper {

    public Byproduct toEntity(ByproductsRequest request, ProcessingBatch processingBatch) {
        if (request == null) return null;

        return Byproduct.builder()
                .liverKg(request.getLiverKg())
                .gizzardKg(request.getGizzardKg())
                .heartKg(request.getHeartKg())
                .bloodLtr(request.getBloodLtr())
                .feathersKg(request.getFeathersKg())
                .processingBatch(processingBatch)
                .build();
    }

    public ByproductsResponse toResponse(Byproduct entity) {
        if (entity == null) return null;

        return ByproductsResponse.builder()
                .id(entity.getId())
                .liverKg(entity.getLiverKg())
                .gizzardKg(entity.getGizzardKg())
                .heartKg(entity.getHeartKg())
                .bloodLtr(entity.getBloodLtr())
                .feathersKg(entity.getFeathersKg())
                .processingBatchId(entity.getProcessingBatch() != null ? entity.getProcessingBatch().getId() : null)
                .build();
    }
}
