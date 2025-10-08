package com.cgdms.CGDMS.processing.slaughterlog;


import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.processing.processingbatch.ProcessingBatch;
import com.cgdms.CGDMS.processing.processingbatch.ProcessingBatchRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SlaughterLogService {

    @Autowired
    private SlaughterLogRepository slaughterLogRepository;

    @Autowired
    private ProcessingBatchRepository processingBatchRepository;

    @Autowired
    private SlaughterLogMapper mapper;

    /**
     * Create or update a SlaughterLog
     */
    public SlaughterLogRequest saveSlaughterLog(SlaughterLogRequest request) {
        SlaughterLog log;
        ProcessingBatch batch = null;

        if (request.getProcessId() != null) {
            batch = processingBatchRepository.findById(request.getProcessId())
                    .orElseThrow(() -> new EntityNotFoundException("ProcessingBatch not found with id: " + request.getProcessId()));
        }

        if (request.getId() != null) {
            // update existing
            log = slaughterLogRepository.findById(request.getId())
                    .orElseThrow(() -> new EntityNotFoundException("SlaughterLog not found with id: " + request.getId()));

            log.setBirdsReceived(request.getBirdsReceived());
            log.setBirdsSlaughtered(request.getBirdsSlaughtered());
            log.setCondemnedCount(request.getCondemnedCount());
            log.setReason(request.getReason());

            if (batch != null) {
                log.setProcessingBatch(batch);
            }

        } else {
            // create new
            log = mapper.toEntity(request, batch);

        }
        log.setArchived(0);
        slaughterLogRepository.save(log);
        return request;
    }

    /**
     * Paginated retrieval of all SlaughterLogs
     */
    public PageResponse<SlaughterLogResponse> findAllSlaughterLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<SlaughterLog> logs = slaughterLogRepository.findAllNotArchived(pageable);

        List<SlaughterLogResponse> responses = logs.stream()
                .map(mapper::toResponse)
                .toList();

        return new PageResponse<>(
                responses,
                logs.getNumber(),
                logs.getSize(),
                logs.getTotalElements(),
                logs.getTotalPages(),
                logs.isFirst(),
                logs.isLast()
        );
    }

    /**
     * Find by ID
     */
    public SlaughterLogResponse findById(Long logId) {
        return slaughterLogRepository.findById(logId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("SlaughterLog not found with id: " + logId));
    }

    /**
     * Soft delete
     */
    public void deleteSlaughterLog(Long logId) {
        SlaughterLog log = slaughterLogRepository.findById(logId)
                .orElseThrow(() -> new EntityNotFoundException("SlaughterLog not found with id: " + logId));

        log.setArchived(1);
        slaughterLogRepository.save(log);
    }
}
