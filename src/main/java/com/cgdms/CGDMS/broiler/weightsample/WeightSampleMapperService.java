package com.cgdms.CGDMS.broiler.weightsample;


import org.springframework.stereotype.Service;

@Service
public class WeightSampleMapperService {


    public WeightSample toEntity(WeightSampleRequest request) {
        if (request == null) return null;

        return WeightSample.builder()
                .date(request.getDate())
                .sampleCount(request.getSampleCount())
                .avgWeightG(request.getAvgWeightG())
                .sd(request.getSd())
                .build();
        // flockId & operatorId resolved in Service
    }

    public WeightSampleResponse toResponse(WeightSample ws) {
        if (ws == null) return null;

        return WeightSampleResponse.builder()
                .id(ws.getId())
                .date(ws.getDate())
                .flockId(ws.getFlock() != null ? ws.getFlock().getId() : null)
                .sampleCount(ws.getSampleCount())
                .avgWeightG(ws.getAvgWeightG())
                .sd(ws.getSd())
//                .operatorId(ws.getOperator() != null ? ws.getOperator().getId() : null)
                .build();
    }
}
