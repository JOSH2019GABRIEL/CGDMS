package com.cgdms.CGDMS.batch;

import com.cgdms.CGDMS.common.AuthUtils;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.pond.Pond;
import com.cgdms.CGDMS.pond.PondRepository;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BatchMovementService {

    private final BatchMovementRepository movementRepository;
    private final BatchRepository batchRepository;
    private final PondRepository pondRepository;
    private final BatchMovementMapper mapper;
    private final AuthUtils authUtils;

    @Transactional
    public BatchMovementResponse create(BatchMovementRequest req) {
        validate(req);

        Batch batch = batchRepository.findById(req.getBatchId())
                .orElseThrow(() -> new EntityNotFoundException("Batch not found with id: " + req.getBatchId()));

        Pond from = pondRepository.findById(req.getFromPondId())
                .orElseThrow(() -> new EntityNotFoundException("Pond not found with id: " + req.getFromPondId()));

        Pond to = pondRepository.findById(req.getToPondId())
                .orElseThrow(() -> new EntityNotFoundException("Pond not found with id: " + req.getToPondId()));

        if (req.getMovedCount() > batch.getInitialCount()) {
            throw new IllegalStateException("Not enough fish in batch to move. Available: "
                    + batch.getInitialCount() + ", Requested: " + req.getMovedCount());
        }

        BatchMovement movement = BatchMovement.builder()
                .batch(batch)
                .fromPond(from)
                .toPond(to)
                .movedCount(req.getMovedCount())
                .movementDate(req.getMovementDate())
                .build();

        int newAvailableFrom = from.getAvailableFingerlin() - req.getMovedCount();

        if (newAvailableFrom < 0) {
            throw new IllegalStateException("Cannot move more fingerlings than available in the source pond. "
                    + "Available: " + from.getAvailableFingerlin() + ", Trying to move: " + req.getMovedCount());
        }

        from.setAvailableFingerlin(newAvailableFrom);
        pondRepository.save(from);

        int newAvailableTo = to.getAvailableFingerlin() + req.getMovedCount();
        if (newAvailableTo > to.getCapacity()) {
            throw new IllegalStateException("Destination pond capacity exceeded. Capacity: "
                    + to.getCapacity() + ", Trying to add: " + req.getMovedCount());
        }

        to.setAvailableFingerlin(newAvailableTo);
        pondRepository.save(to);

        movementRepository.save(movement);
        batchRepository.save(batch);

        return mapper.toResponse(movement);
    }

    @Transactional //(readOnly = true)
    public BatchMovementResponse findById(Long id) {
        BatchMovement m = movementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("BatchMovement not found with id: " + id));
        return mapper.toResponse(m);
    }

    @Transactional //(readOnly = true)
    public PageResponse<BatchMovementResponse> findAll(int page, int size) {
        User loggedInUser = authUtils.getCurrentUser();
        boolean isAdmin = authUtils.isAdmin();
        Long farmId = authUtils.getCurrentUserFarmId();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "movementDate", "createdDate"));
        Page<BatchMovement> p = isAdmin ? movementRepository.findAllNotArchived(pageable, farmId)
                : movementRepository.findAllNotArchivedForUsers(pageable, loggedInUser.getId(), farmId);
        var content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }

    @Transactional //(readOnly = true)
    public PageResponse<BatchMovementResponse> findByBatch(Long batchId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "movementDate"));
        Page<BatchMovement> p = movementRepository.findByBatchId(batchId, pageable);
        var content = p.stream().map(mapper::toResponse).toList();
        return new PageResponse<>(content, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isFirst(), p.isLast());
    }

    private void validate(BatchMovementRequest req) {
        if (req.getFromPondId() != null && req.getToPondId() != null &&
                req.getFromPondId().equals(req.getToPondId())) {
            throw new IllegalArgumentException("fromPondId and toPondId cannot be the same");
        }
    }
}
