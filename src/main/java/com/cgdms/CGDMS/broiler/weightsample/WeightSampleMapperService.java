package com.cgdms.CGDMS.broiler.weightsample;


import com.cgdms.CGDMS.broiler.flock.Flock;
import com.cgdms.CGDMS.broiler.flock.FlockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WeightSampleMapperService {

    private final FlockRepository flockRepository;


    public WeightSample toEntity(WeightSampleRequest request) {
        if (request == null) return null;

        Flock flock = flockRepository.findById(request.getFlockId())
                .orElseThrow(() -> new IllegalArgumentException("Flock not found"));

        return WeightSample.builder()
                .date(request.getDate())
                .sampleCount(request.getSampleCount())
                .avgWeightG(request.getAvgWeightG())
                .sd(request.getSd())
                .flock(flock)
                .build();
    }

    public WeightSampleResponse toResponse(WeightSample ws) {
        if (ws == null) return null;


        return WeightSampleResponse.builder()
                .id(ws.getId())
                .date(ws.getDate())
                .flockId(ws.getFlock() != null ? ws.getFlock().getId() : null)
                .fullFlock((ws.getFlock() != null ? ws.getFlock().getId() : "") + "-" + (ws.getFlock() != null ? ws.getFlock().getSource() : ""))
                .sampleCount(ws.getSampleCount())
                .avgWeightG(ws.getAvgWeightG())
                .sd(ws.getSd())
                .build();
    }
}
