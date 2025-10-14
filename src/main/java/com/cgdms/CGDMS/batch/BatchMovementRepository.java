package com.cgdms.CGDMS.batch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BatchMovementRepository extends JpaRepository<BatchMovement, Long> {

    Page<BatchMovement> findByBatchId(Long batchId, Pageable pageable);

    Page<BatchMovement> findByFromPond_IdOrToPond_Id(Long fromPondId, Long toPondId, Pageable pageable);

    @Query("""
    SELECT m
    FROM BatchMovement m
    WHERE m.farm.id = :farmId
    AND m.archived = 0
    AND m.operatorUserId = :operatorUserId
""")
    Page<BatchMovement> findAllNotArchivedForUsers(Pageable pageable, Integer userId, Long farmId);

    @Query("""
    SELECT m
    FROM BatchMovement m
    WHERE m.farm.id = :farmId
    AND m.archived = 0
""")
    Page<BatchMovement> findAllNotArchived(Pageable pageable, Long farmId);
}
