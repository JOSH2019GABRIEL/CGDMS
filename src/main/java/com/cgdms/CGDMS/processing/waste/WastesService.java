package com.cgdms.CGDMS.processing.waste;


import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.processing.processingbatch.ProcessingBatch;
import com.cgdms.CGDMS.processing.processingbatch.ProcessingBatchRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WastesService {

    @Autowired
    private WastesRepository wastesRepository;

    @Autowired
    private ProcessingBatchRepository processingBatchRepository;

    @Autowired
    private WastesMapper mapper;

    /**
     * Create or update a Waste record
     */
    public WastesRequest saveWaste(WastesRequest request) {
        Wastes waste;
        ProcessingBatch batch = null;

        if (request.getProcessId() != null) {
            batch = processingBatchRepository.findById(request.getProcessId())
                    .orElseThrow(() -> new EntityNotFoundException("ProcessingBatch not found with id: " + request.getProcessId()));
        }

        if (request.getId() != null) {
            // update existing
            waste = wastesRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Waste not found with id: " + request.getId()));

            waste.setInedibleWasteKg(request.getInedibleWasteKg());
            waste.setPackagingWasteKg(request.getPackagingWasteKg());
            waste.setEffluentEstimateKg(request.getEffluentEstimateKg());
            waste.setDisposalMethod(request.getDisposalMethod());

            if (batch != null) {
                waste.setProcessingBatch(batch);
            }

        } else {
            // create new using mapper
            waste = mapper.toEntity(request, batch);
        }

        waste.setArchived(0);
        wastesRepository.save(waste);
        return request;
    }


    /**
     * Paginated retrieval of all Wastes
     */
    public PageResponse<WastesResponse> findAllWastes(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<Wastes> wastes = wastesRepository.findAllNotArchived(pageable);

        List<WastesResponse> responses = wastes.stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                wastes.getNumber(),
                wastes.getSize(),
                wastes.getTotalElements(),
                wastes.getTotalPages(),
                wastes.isFirst(),
                wastes.isLast()
        );
    }

    /**
     * Find waste by ID
     */
    public WastesResponse findById(Long wasteId) {
        return wastesRepository.findById(wasteId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Waste not found with id: " + wasteId));
    }

    /**
     * Soft delete
     */
    public void deleteWaste(Long wasteId) {
        Wastes waste = wastesRepository.findById(wasteId)
                .orElseThrow(() -> new EntityNotFoundException("Waste not found with id: " + wasteId));

        waste.setArchived(1);
        wastesRepository.save(waste);
    }
}
