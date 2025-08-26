package com.cgdms.CGDMS.batch;

import com.cgdms.CGDMS.pond.Pond;
import com.cgdms.CGDMS.pond.PondRepository;
import com.cgdms.CGDMS.pond.PondRequest;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BatchService {

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private PondRepository pondRepository;

    @Autowired
    private BatchMapperService batchMapper;

        public BatchRequest saveBatch(BatchRequest batchRequest) {
        Batch batch;

        if (batchRequest.getId() != null) {
            // Updating an existing batch
            batch = batchRepository.findById(batchRequest.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Pond not found with id: " + batchRequest.getId()));

            Pond pond = pondRepository.findById(batchRequest.getPondId())
                    .orElseThrow(() -> new EntityNotFoundException("Pond not found with id: " + batchRequest.getPondId()));

            // update only relevant fields
            batch.setPond(pond);
            batch.setSource(batchRequest.getSource());
            batch.setStockDate(batchRequest.getStockDate());
            batch.setInitialAvgWeightG(batch.getInitialAvgWeightG());
            batch.setInitialCount(batch.getInitialCount());

        } else {
            // Creating new batch
            batch = batchMapper.toBatch(batchRequest);
        }

        batchRepository.save(batch);
        return batchRequest;
    }
}
