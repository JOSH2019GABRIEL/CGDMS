package com.cgdms.CGDMS.processing.processingbatch;


import com.cgdms.CGDMS.broiler.harvest.HarvestEvent;
import com.cgdms.CGDMS.broiler.harvest.HarvestEventRepository;
import com.cgdms.CGDMS.common.PageResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProcessingBatchService {

    @Autowired
    private ProcessingBatchRepository processingBatchRepository;

    @Autowired
    private HarvestEventRepository harvestEventRepository;

    @Autowired
    private ProcessingBatchMapper mapper;

    /**
     * Create or update a ProcessingBatch
     */
    public ProcessingBatchRequest saveProcessingBatch(ProcessingBatchRequest request) {
        ProcessingBatch batch;
        HarvestEvent harvestEvent = null;

        if (request.getHarvestEventId() != null) {
            harvestEvent = harvestEventRepository.findById(request.getHarvestEventId())
                    .orElseThrow(() -> new EntityNotFoundException("Harvest Event not found with id: " + request.getHarvestEventId()));
        }

        if (request.getId() != null) {
            // update existing
            batch = processingBatchRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("ProcessingBatch not found with id: " + request.getId()));

            batch.setDate(request.getDate());
            batch.setPlantLocation(request.getPlantLocation());
            batch.setOperator(request.getOperator());

           if (harvestEvent != null) {
               batch.setHarvestEvent(harvestEvent);
           }
        } else {
            // create new
            batch = mapper.toEntity(request, harvestEvent);
        }

        processingBatchRepository.save(batch);
        return request;
    }

    /**
     * Paginated retrieval of all ProcessingBatches
     */
    public PageResponse<ProcessingBatchResponse> findAllProcessingBatches(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<ProcessingBatch> batches = processingBatchRepository.findAllNotArchived(pageable);

        List<ProcessingBatchResponse> responses = batches.stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                batches.getNumber(),
                batches.getSize(),
                batches.getTotalElements(),
                batches.getTotalPages(),
                batches.isFirst(),
                batches.isLast()
        );
    }

    /**
     * Find by ID
     */
    public ProcessingBatchResponse findById(Long batchId) {
        return processingBatchRepository.findById(batchId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("ProcessingBatch not found with id: " + batchId));
    }

    /**
     * Soft delete
     */
    public void deleteProcessingBatch(Long batchId) {
        ProcessingBatch batch = processingBatchRepository.findById(batchId)
                .orElseThrow(() -> new EntityNotFoundException("ProcessingBatch not found with id: " + batchId));

        batch.setArchived(1);
        processingBatchRepository.save(batch);
    }
}
