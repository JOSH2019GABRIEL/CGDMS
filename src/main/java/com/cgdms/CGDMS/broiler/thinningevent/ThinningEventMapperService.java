package com.cgdms.CGDMS.broiler.thinningevent;

import org.springframework.stereotype.Service;

@Service
public class ThinningEventMapperService {

    public ThinningEvent toEntity(ThinningEventRequest request) {
        if (request == null) return null;

        return ThinningEvent.builder()
                .date(request.getDate())
                .numberRemoved(request.getNumberRemoved())
                .averageWeight(request.getAverageWeight())
                .destination(request.getDestination())
                .build();
        // flockId resolved in Service
    }

    public ThinningEventResponse toResponse(ThinningEvent t) {
        if (t == null) return null;

        return ThinningEventResponse.builder()
                .id(t.getId())
                .date(t.getDate())
                .flockId(t.getFlock() != null ? t.getFlock().getId() : null)
                .numberRemoved(t.getNumberRemoved())
                .averageWeight(t.getAverageWeight())
                .destination(t.getDestination())
                .fullFlock((t.getFlock() != null ? t.getFlock().getId() : "") + "-" + (t.getFlock() != null ? t.getFlock().getSource() : ""))
                .build();
    }
}
