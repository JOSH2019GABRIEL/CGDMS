package com.cgdms.CGDMS.performance;

import com.cgdms.CGDMS.batch.Batch;
import com.cgdms.CGDMS.batch.BatchRepository;
import com.cgdms.CGDMS.pond.Pond;
import com.cgdms.CGDMS.pond.PondRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
@Transactional
public class PerformanceService {

    private final PerformanceRepository performanceRepository;
    private final PondRepository pondRepository;
    private final BatchRepository batchRepository;
    private final PerformanceMapper mapper;

    public PerformanceResponse createPerformance(PerformanceRequest request) {
        Pond pond = pondRepository.findById(request.getPondId())
                .orElseThrow(() -> new EntityNotFoundException("Pond not found with id: " + request.getPondId()));

        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new EntityNotFoundException("Batch not found with id: " + request.getBatchId()));

        Performance performance = mapper.toEntity(request, pond, batch);
        Performance saved = performanceRepository.save(performance);
        return mapper.toResponse(saved);
    }

    public PerformanceResponse updatePerformance(Long id, PerformanceRequest request) {
        Performance performance = performanceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Performance not found with id: " + id));

        // update relationships if changed
        if (request.getPondId() != null &&
                (performance.getPond() == null || !performance.getPond().getId().equals(request.getPondId()))) {
            Pond pond = pondRepository.findById(request.getPondId())
                    .orElseThrow(() -> new EntityNotFoundException("Pond not found with id: " + request.getPondId()));
            performance.setPond(pond);
        }

        if (request.getBatchId() != null &&
                (performance.getBatch() == null || !performance.getBatch().getId().equals(request.getBatchId()))) {
            Batch batch = batchRepository.findById(request.getBatchId())
                    .orElseThrow(() -> new EntityNotFoundException("Batch not found with id: " + request.getBatchId()));
            performance.setBatch(batch);
        }

        // update scalar fields
        performance.setDate(request.getDate() != null ? request.getDate() : performance.getDate());
        performance.setAvgWeightG(request.getAvgWeightG() != null ? request.getAvgWeightG() : performance.getAvgWeightG());
        performance.setLiveCount(request.getLiveCount() != null ? request.getLiveCount() : performance.getLiveCount());
//        performance.setBiomassKg(request.get() != null ? request.getBiomassKg() : performance.getBiomassKg());

        Performance updated = performanceRepository.save(performance);
        return mapper.toResponse(updated);
    }


    // ✅ Pageable version
    public Page<PerformanceResponse> getAllPerformances(Pageable pageable) {
        return performanceRepository.findAll(pageable)
                .map(mapper::toResponse);
    }

    public PerformanceResponse getPerformanceById(Long id) {
        return performanceRepository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Performance not found with id: " + id));
    }

    public void deletePerformance(Long id) {
        if (!performanceRepository.existsById(id)) {
            throw new EntityNotFoundException("Performance not found with id: " + id);
        }
        performanceRepository.deleteById(id);
    }
}

