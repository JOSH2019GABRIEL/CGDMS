package com.cgdms.CGDMS.broiler.flock;

import org.springframework.stereotype.Service;

@Service
public class FlockMapperService {

    public Flock toEntity(FlockRequest request) {
        if (request == null) return null;

        return Flock.builder()
                .source(request.getSource())
                .hatchDate(request.getHatchDate())
                .stockingCount(request.getStockingCount())
                .sexRatio(request.getSexRatio())
                .expectedCycleDays(request.getExpectedCycleDays())
                .targetWeight(request.getTargetWeight())
                .vaccineProfile(request.getVaccineProfile())
                .build();
    }

    public FlockResponse toResponse(Flock flock) {
        if (flock == null) return null;

        return FlockResponse.builder()
                .id(flock.getId())
//                .houseId(flock.getHouse() != null ? flock.getHouse().getId() : null)
                .source(flock.getSource())
                .hatchDate(flock.getHatchDate())
                .stockingCount(flock.getStockingCount())
                .sexRatio(flock.getSexRatio())
                .expectedCycleDays(flock.getExpectedCycleDays())
                .targetWeight(flock.getTargetWeight())
                .vaccineProfile(flock.getVaccineProfile())
                .build();
    }
}
