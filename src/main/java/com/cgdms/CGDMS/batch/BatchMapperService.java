package com.cgdms.CGDMS.batch;

import com.cgdms.CGDMS.pond.Pond;
import com.cgdms.CGDMS.pond.PondRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BatchMapperService {

    @Autowired
    private PondRepository pondRepository;


    public Batch toBatch(BatchRequest request) {
        Pond pond = pondRepository.findById(request.getPondId())
                .orElseThrow(() -> new RuntimeException("Pond not found with id " + request.getPondId()));

        return Batch.builder()
                .pond(pond)
                .source(request.getSource())
                .stockDate(request.getStockDate())
                .initialAvgWeightG(request.getInitialAvgWeightG())
                .initialCount(request.getInitialCount())
                .build();
    }

    public BatchResponse toBatchResponse(Batch batch) {
        return BatchResponse.builder()
                .id(batch.getId())
                .pondName(batch.getPond().getName())
                .source(batch.getSource())
                .stockDate(batch.getStockDate())
                .initialAvgWeightG(batch.getInitialAvgWeightG())
                .initialCount(batch.getInitialCount())
//                .createdBy(batch.getCreatedBy())
//                .createdDate(batch.getCreatedDate())
                .build();
    }
}