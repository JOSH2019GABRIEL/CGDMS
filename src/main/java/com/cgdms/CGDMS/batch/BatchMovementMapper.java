package com.cgdms.CGDMS.batch;

import com.cgdms.CGDMS.pond.Pond;
import org.springframework.stereotype.Service;

@Service
public class BatchMovementMapper {


    public BatchMovementResponse toResponse(BatchMovement m) {
        return BatchMovementResponse.builder()
                .id(m.getId())
                .batchId(m.getBatch().getId())
                .batchSource(m.getBatch().getSource())
                .fromPondId(m.getFromPond().getId())
                .fromPondName(m.getFromPond().getName())
                .toPondId(m.getToPond().getId())
                .toPondName(m.getToPond().getName())
                .movementDate(m.getMovementDate())
                .movedCount(m.getMovedCount())
                .reason(m.getReason())
                .build();
    }

    public void apply(BatchMovement target, Batch batch, Pond from, Pond to, BatchMovementRequest req) {
        target.setBatch(batch);
        target.setFromPond(from);
        target.setToPond(to);
        target.setMovementDate(req.getMovementDate());
        target.setMovedCount(req.getMovedCount());
        target.setReason(req.getReason());
    }
}
