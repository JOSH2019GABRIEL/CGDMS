package com.cgdms.CGDMS.batch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchMovementRepository extends JpaRepository<BatchMovement, Long> {

    Page<BatchMovement> findByBatchId(Long batchId, Pageable pageable);

    Page<BatchMovement> findByFromPond_IdOrToPond_Id(Long fromPondId, Long toPondId, Pageable pageable);
}
