package com.cgdms.CGDMS.processing.cutupyield;


import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.processing.processingbatch.ProcessingBatch;
import com.cgdms.CGDMS.processing.processingbatch.ProcessingBatchRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CutupYieldService {

    @Autowired
    private CutupYieldRepository cutupYieldRepository;

    @Autowired
    private ProcessingBatchRepository processingBatchRepository;

    @Autowired
    private CutupYieldMapper mapper;

    /**
     * Create or update a CutupYield
     */
    public CutupYieldRequest saveCutupYield(CutupYieldRequest request) {
        CutupYield cutupYield;
        ProcessingBatch batch = null;

        if (request.getProcessingBatchId() != null) {
            batch = processingBatchRepository.findById(request.getProcessId())
                    .orElseThrow(() -> new EntityNotFoundException("ProcessingBatch not found with id: " + request.getProcessId()));
        }

        if (request.getId() != null) {
            // update existing
            cutupYield = cutupYieldRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("CutupYield not found with id: " + request.getId()));

            cutupYield.setWholeBirdsCount(request.getWholeBirdsCount());
            cutupYield.setBreastKg(request.getBreastKg());
            cutupYield.setThighKg(request.getThighKg());
            cutupYield.setWingKg(request.getWingKg());
            cutupYield.setDrumstickKg(request.getDrumstickKg());
            cutupYield.setCarcassKg(request.getCarcassKg());

            if (batch != null) {
                cutupYield.setProcessingBatch(batch);
            }

        } else {
            // create new
            cutupYield = mapper.toEntity(request, batch);
        }

        cutupYieldRepository.save(cutupYield);
        return request;
    }

    /**
     * Paginated retrieval of all CutupYields
     */
    public PageResponse<CutupYieldResponse> findAllCutupYields(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<CutupYield> cutupYields = cutupYieldRepository.findAllNotArchived(pageable);

        List<CutupYieldResponse> responses = cutupYields.stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                cutupYields.getNumber(),
                cutupYields.getSize(),
                cutupYields.getTotalElements(),
                cutupYields.getTotalPages(),
                cutupYields.isFirst(),
                cutupYields.isLast()
        );
    }

    /**
     * Find by ID
     */
    public CutupYieldResponse findById(Long cutupYieldId) {
        return cutupYieldRepository.findById(cutupYieldId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("CutupYield not found with id: " + cutupYieldId));
    }

    /**
     * Soft delete
     */
    public void deleteCutupYield(Long cutupYieldId) {
        CutupYield cutupYield = cutupYieldRepository.findById(cutupYieldId)
                .orElseThrow(() -> new EntityNotFoundException("CutupYield not found with id: " + cutupYieldId));

        cutupYield.setArchived(1);
        cutupYieldRepository.save(cutupYield);
    }
}
