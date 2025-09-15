package com.cgdms.CGDMS.performance;

import com.cgdms.CGDMS.batch.Batch;
import com.cgdms.CGDMS.pond.Pond;
import org.springframework.stereotype.Service;

@Service
public class PerformanceMapper {

    public Performance toEntity(PerformanceRequest request, Pond pond, Batch batch) {
        Double biomassKg = 0.0;
        if (request.getAvgWeightG() != null && request.getLiveCount() != null) {
            biomassKg = (request.getAvgWeightG() * request.getLiveCount()) / 1000.0;
        }

        return Performance.builder()
                .date(request.getDate())
                .pond(pond)
                .batch(batch)
                .avgWeightG(request.getAvgWeightG())
                .liveCount(request.getLiveCount())
                .biomassKg(biomassKg)
                .build();
    }

    public PerformanceResponse toResponse(Performance performance) {
        return PerformanceResponse.builder()
                .id(performance.getId())
                .date(performance.getDate())
                .pondId(performance.getPond() != null ? performance.getPond().getId() : null)
                .pondName(performance.getPond() != null ? performance.getPond().getName() : null)
                .batchId(performance.getBatch() != null ? performance.getBatch().getId() : null)
//                .batchN(performance.getBatch() != null ? performance.getBatch().getId() : null)
                .avgWeightG(performance.getAvgWeightG())
                .liveCount(performance.getLiveCount())
                .biomassKg(performance.getBiomassKg())
                .build();
    }
}

