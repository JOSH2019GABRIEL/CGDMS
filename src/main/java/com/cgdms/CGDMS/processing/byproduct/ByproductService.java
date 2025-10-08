package com.cgdms.CGDMS.processing.byproduct;


import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.processing.processingbatch.ProcessingBatch;
import com.cgdms.CGDMS.processing.processingbatch.ProcessingBatchRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ByproductService {

    @Autowired
    private ByproductRepository byproductRepository;

    @Autowired
    private ProcessingBatchRepository processingBatchRepository;

    @Autowired
    private ByproductMapper mapper;

    /**
     * Create or update a Byproduct
     */
    public ByproductsRequest saveByproduct(ByproductsRequest request) {
        Byproduct byproduct;
        ProcessingBatch batch = null;

        if (request.getProcessingBatchId() != null) {
            batch = processingBatchRepository.findById(request.getProcessingBatchId())
                    .orElseThrow(() -> new EntityNotFoundException("ProcessingBatch not found with id: " + request.getProcessingBatchId()));
        }

        if (request.getId() != null) {
            // update existing
            byproduct = byproductRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Byproduct not found with id: " + request.getId()));

            byproduct.setLiverKg(request.getLiverKg());
            byproduct.setGizzardKg(request.getGizzardKg());
            byproduct.setHeartKg(request.getHeartKg());
            byproduct.setBloodLtr(request.getBloodLtr());
            byproduct.setFeathersKg(request.getFeathersKg());

            if (batch != null) {
                byproduct.setProcessingBatch(batch);
            }

        } else {
            // create new
            byproduct = mapper.toEntity(request, batch);

        }

        byproduct.setArchived(0);
        byproductRepository.save(byproduct);
        return request;
    }

    /**
     * Paginated retrieval of all Byproducts
     */
    public PageResponse<ByproductsResponse> findAllByproducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<Byproduct> byproducts = byproductRepository.findAllNotArchived(pageable);

        List<ByproductsResponse> responses = byproducts.stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                byproducts.getNumber(),
                byproducts.getSize(),
                byproducts.getTotalElements(),
                byproducts.getTotalPages(),
                byproducts.isFirst(),
                byproducts.isLast()
        );
    }

    /**
     * Find by ID
     */
    public ByproductsResponse findById(Long byproductId) {
        return byproductRepository.findById(byproductId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Byproduct not found with id: " + byproductId));
    }

    /**
     * Soft delete
     */
    public void deleteByproduct(Long byproductId) {
        Byproduct byproduct = byproductRepository.findById(byproductId)
                .orElseThrow(() -> new EntityNotFoundException("Byproduct not found with id: " + byproductId));

        byproduct.setArchived(1);
        byproductRepository.save(byproduct);
    }
}
