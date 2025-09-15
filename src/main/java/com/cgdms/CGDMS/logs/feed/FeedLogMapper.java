package com.cgdms.CGDMS.logs.feed;

import com.cgdms.CGDMS.batch.BatchRepository;
import com.cgdms.CGDMS.pond.PondRepository;
import com.cgdms.CGDMS.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FeedLogMapper {

    private final PondRepository pondRepository;
    private final BatchRepository batchRepository;
    private final UserRepository staffRepository;

    public FeedLog toFeedLog(FeedLogRequest req) {
        FeedLog f = FeedLog.builder()
                .date(req.getDate())
                .feedType(req.getFeedType())
                .brand(req.getBrand())
                .quantityKg(req.getQuantityKg())
                .method(req.getMethod())
                .timeOfDay(req.getTimeOfDay())
                .notes(req.getNotes())
                .archived(0)
                .build();

        // pond (required)
        pondRepository.findById(req.getPondId()).ifPresentOrElse(
               f::setPond,
                () -> { throw new IllegalArgumentException("Pond not found with id: " + req.getPondId()); }
        );

        // optional batch
        if (req.getBatchId() != null) {
            batchRepository.findById(req.getBatchId()).ifPresentOrElse(
                    f::setBatch,
                    () -> { throw new IllegalArgumentException("Batch not found with id: " + req.getBatchId()); }
            );
        }

        TODO: // optional staff
        if (req.getStaffId() != null) {
            staffRepository.findById(req.getStaffId()).ifPresentOrElse(
                    f::setStaff,
                    () -> { throw new IllegalArgumentException("Staff not found with id: " + req.getStaffId()); }
            );
        }

        return f;
    }

    public FeedLogResponse toResponse(FeedLog entity) {
        return FeedLogResponse.builder()
                .id(entity.getId())
                .date(entity.getDate())
                .pondId(entity.getPond() != null ? entity.getPond().getId() : null)
                .pondName(entity.getPond() != null ? entity.getPond().getName() : null)
                .batchId(entity.getBatch() != null ? entity.getBatch().getId() : null)
                .feedType(entity.getFeedType())
                .brand(entity.getBrand())
                .quantityKg(entity.getQuantityKg())
                .method(entity.getMethod())
                .timeOfDay(entity.getTimeOfDay())
                .staffId(entity.getStaff() != null ? entity.getStaff().getId() : null)
                .staffName(entity.getStaff() != null ? entity.getStaff().getName() : null)
                .notes(entity.getNotes())
                .build();
    }

    public void applyUpdate(FeedLog target, FeedLogRequest req) {
        if (req.getDate() != null) target.setDate(req.getDate());
        if (req.getFeedType() != null) target.setFeedType(req.getFeedType());
        if (req.getBrand() != null) target.setBrand(req.getBrand());
        if (req.getQuantityKg() != null) target.setQuantityKg(req.getQuantityKg());
        if (req.getMethod() != null) target.setMethod(req.getMethod());
        if (req.getTimeOfDay() != null) target.setTimeOfDay(req.getTimeOfDay());
        if (req.getNotes() != null) target.setNotes(req.getNotes());

        if (req.getPondId() != null) {
            pondRepository.findById(req.getPondId()).ifPresentOrElse(
                    target::setPond,
                    () -> { throw new IllegalArgumentException("Pond not found with id: " + req.getPondId()); }
            );
        }
        if (req.getBatchId() != null) {
            batchRepository.findById(req.getBatchId()).ifPresentOrElse(
                    target::setBatch,
                    () -> { throw new IllegalArgumentException("Batch not found with id: " + req.getBatchId()); }
            );
        }
        if (req.getStaffId() != null) {
            staffRepository.findById(req.getStaffId()).ifPresentOrElse(
                    target::setStaff,
                    () -> { throw new IllegalArgumentException("Staff not found with id: " + req.getStaffId()); }
            );
        }
    }
}