package com.cgdms.CGDMS.batch;

import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.pond.Pond;
import com.cgdms.CGDMS.pond.PondRepository;
import com.cgdms.CGDMS.user.User;
import com.cgdms.CGDMS.user.UserRepository;
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
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthUtils authUtils;

    public BatchRequest saveBatch(BatchRequest batchRequest) {
        Batch batch;

        if (batchRequest.getId() != null) {
            // Updating an existing batch
            batch = batchRepository.findById(batchRequest.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Batch not found with id: " + batchRequest.getId()));

            Pond pond = pondRepository.findById(batchRequest.getPondId())
                    .orElseThrow(() -> new EntityNotFoundException("Pond not found with id: " + batchRequest.getPondId()));

            int newAvailable = pond.getAvailableFingerlin() + batch.getInitialCount();

            if (newAvailable > pond.getCapacity()) {
                throw new IllegalStateException("Pond capacity exceeded. Capacity: "
                        + pond.getCapacity() + ", Trying to add: " + newAvailable);
            }

            pond.setAvailableFingerlin(newAvailable);
            pondRepository.save(pond);

            // ✅ update only relevant fields
            batch.setPond(pond);
            batch.setSource(batchRequest.getSource());
            batch.setStockDate(batchRequest.getStockDate());
            batch.setInitialAvgWeightG(batchRequest.getInitialAvgWeightG());
            batch.setInitialCount(batchRequest.getInitialCount());

        } else {
            // Creating new batch
            batch = batchMapper.toBatch(batchRequest);

            Pond pond = pondRepository.findById(batchRequest.getPondId())
                    .orElseThrow(() -> new EntityNotFoundException("Pond not found with id: " + batchRequest.getPondId()));

            // ✅ check pond capacity before assigning
            int newAvailable = pond.getAvailableFingerlin() + batch.getInitialCount();

            if (newAvailable > pond.getCapacity()) {
                throw new IllegalStateException("Pond capacity exceeded. Capacity: "
                        + pond.getCapacity() + ", Trying to add: " + newAvailable);
            }

            pond.setAvailableFingerlin(newAvailable);
            pondRepository.save(pond);
        }

        batchRepository.save(batch);

        return batchRequest;
    }

    public PageResponse<BatchResponse> findAllBatch(int page, int size) {

        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<Batch> batches = isAdmin
                ? batchRepository.findAllNotArchived(pageable, farmId)
                : batchRepository.findAllNotArchivedForUsers(pageable, loggedInUser.getId(), farmId);

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

    public Integer totalNumberOfFingerlings() {
        Long farmId = authUtils.getCurrentUserFarmId();

        return batchRepository.getSumOfAllFingerlings(farmId);
    }
}
