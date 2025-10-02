package com.cgdms.CGDMS.processing.slaughterlog;

import com.cgdms.CGDMS.processing.processingbatch.ProcessingBatch;
import org.springframework.stereotype.Service;

@Service
public class SlaughterLogMapper {

    public SlaughterLog toEntity(SlaughterLogRequest request, ProcessingBatch processingBatch) {
        if (request == null) return null;

        return SlaughterLog.builder()
                .birdsReceived(request.getBirdsReceived())
                .birdsSlaughtered(request.getBirdsSlaughtered())
                .condemnedCount(request.getCondemnedCount())
                .reason(request.getReason())
                .processingBatch(processingBatch)
                .build();
    }

    public SlaughterLogResponse toResponse(SlaughterLog entity) {
        if (entity == null) return null;

        return SlaughterLogResponse.builder()
                .id(entity.getId())
                .birdsReceived(entity.getBirdsReceived())
                .birdsSlaughtered(entity.getBirdsSlaughtered())
                .condemnedCount(entity.getCondemnedCount())
                .reason(entity.getReason())
                .processId(entity.getProcessingBatch() != null ? entity.getProcessingBatch().getId() : null)
                .build();
    }
}
