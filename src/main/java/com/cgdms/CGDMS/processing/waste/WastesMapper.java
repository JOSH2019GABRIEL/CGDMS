package com.cgdms.CGDMS.processing.waste;


import com.cgdms.CGDMS.processing.processingbatch.ProcessingBatch;
import org.springframework.stereotype.Service;

@Service
public class WastesMapper {

    public Wastes toEntity(WastesRequest request, ProcessingBatch processingBatch) {
        if (request == null) return null;

        return Wastes.builder()
                .inedibleWasteKg(request.getInedibleWasteKg())
                .packagingWasteKg(request.getPackagingWasteKg())
                .effluentEstimateKg(request.getEffluentEstimateKg())
                .disposalMethod(request.getDisposalMethod())
                .processingBatch(processingBatch)
                .build();
    }

    public WastesResponse toResponse(Wastes entity) {
        if (entity == null) return null;

        return WastesResponse.builder()
                .id(entity.getId())
                .inedibleWasteKg(entity.getInedibleWasteKg())
                .packagingWasteKg(entity.getPackagingWasteKg())
                .effluentEstimateKg(entity.getEffluentEstimateKg())
                .disposalMethod(entity.getDisposalMethod())
                .processId(entity.getProcessingBatch() != null ? entity.getProcessingBatch().getId() : null)
                .build();
    }
}
