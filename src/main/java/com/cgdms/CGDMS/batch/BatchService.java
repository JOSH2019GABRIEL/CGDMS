package com.cgdms.CGDMS.batch;

import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.pond.Pond;
import com.cgdms.CGDMS.pond.PondRepository;
import com.cgdms.CGDMS.pond.PondRequest;
import com.cgdms.CGDMS.pond.PondResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

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
                    .orElseThrow(() -> new EntityNotFoundException("Batch not found with id: " + batchRequest.getId()));

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

    public PageResponse<BatchResponse> findAllBatch(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<Batch> batches = batchRepository.findAllNotArchived(pageable); // or findAllUsers if you need custom filtering

        List<BatchResponse> batchResponses = batches.stream()
                .map(batchMapper::toBatchResponse)
                .toList();

        return new PageResponse<>(
                batchResponses,
                batches.getNumber(),
                batches.getSize(),
                batches.getTotalElements(),
                batches.getTotalPages(),
                batches.isFirst(),
                batches.isLast()
        );
    }

    public BatchResponse findById(Long batchId) {
        return batchRepository.findById(batchId)
                .map(batchMapper::toBatchResponse)
                .orElseThrow(()-> new EntityNotFoundException("Batch ID couldnt be found: " +batchId));
    }

    public void deleteBatch (Long batchId) {
        Batch batch = batchRepository.findById(batchId).orElseThrow(()-> new RuntimeException("Batch not found"));
        batch.setArchived(1);
        batchRepository.save(batch);

    }
}
