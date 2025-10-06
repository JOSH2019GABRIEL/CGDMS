package com.cgdms.CGDMS.broiler.harvest;

import org.springframework.stereotype.Service;

@Service
public class HarvestEventMapperService {


    public HarvestEvent toEntity(HarvestEventRequest request) {
        if (request == null) return null;

        return HarvestEvent.builder()
                .date(request.getDate())
                .totalHarvested(request.getTotalHarvested())
                .averageLiveWeight(request.getAverageLiveWeight())
                .cullCount(request.getCullCount())
                .build();
        // flockId & operatorId resolved in Service
    }

    public HarvestEventResponse toResponse(HarvestEvent h) {
        if (h == null) return null;

        return HarvestEventResponse.builder()
                .id(h.getId())
                .date(h.getDate())
                .flockId(h.getFlock() != null ? h.getFlock().getId() : null)
                .totalHarvested(h.getTotalHarvested())
                .averageLiveWeight(h.getAverageLiveWeight())
                .cullCount(h.getCullCount())
                .fullFlock((h.getFlock() != null ? h.getFlock().getId() : "") + "-" + (h.getFlock() != null ? h.getFlock().getSource() : ""))

//                .operatorId(h.getOperator() != null ? h.getOperator().getId() : null)
                .build();
    }
}
