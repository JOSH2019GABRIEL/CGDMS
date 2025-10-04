package com.cgdms.CGDMS.broiler.flock;

import com.cgdms.CGDMS.farm.Farm;
import org.springframework.stereotype.Service;


@Service
public class FlockMapperService {

    public Flock toEntity(FlockRequest request) {
        if (request == null) return null;

        Flock flock = Flock.builder()
                .source(request.getSource())
                .hatchDate(request.getHatchDate())
                .stockingCount(request.getStockingCount())
                .sexRatio(request.getSexRatio())
                .expectedCycleDays(request.getExpectedCycleDays())
                .targetWeight(request.getTargetWeight())
                .vaccineProfile(request.getVaccineProfile())
                .build();


        return flock;
    }

    public FlockResponse toResponse(Flock flock) {
        if (flock == null) return null;

        return FlockResponse.builder()
                .id(flock.getId())
                .source(flock.getSource())
                .hatchDate(flock.getHatchDate())
                .stockingCount(flock.getStockingCount())
                .sexRatio(flock.getSexRatio())
                .expectedCycleDays(flock.getExpectedCycleDays())
                .targetWeight(flock.getTargetWeight())
                .vaccineProfile(flock.getVaccineProfile())
                // Prevent recursion: only map simple farm fields, not full entity
                .farmId(flock.getFarm() != null ? flock.getFarm().getId() : null)
                .farmName(flock.getFarm() != null ? flock.getFarm().getFarmName() : null)
                .build();
    }
}
