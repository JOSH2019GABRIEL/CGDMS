package com.cgdms.CGDMS.batch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {
    @Query("""
       SELECT batch 
       FROM Batch batch
       WHERE batch.archived = 0 AND batch.farm.id = :farmId
       """)
    Page<Batch> findAllNotArchived(Pageable pageable, Long farmId);

    @Query("""
       SELECT batch 
       FROM Batch batch
       WHERE batch.operatorUserId = :userId 
       AND batch.farm.id = :farmId
       AND batch.archived = 0
       """)
    Page<Batch> findAllNotArchivedForUsers(Pageable pageable, @Param("userId") Integer userId, @Param("farmId") Long farmId);

    @Query(value = """
                SELECT SUM(batch.initialCount) 
                FROM Batch batch
                WHERE batch.farm.id = :farmId
                AND batch.archived = 0
                """)
    Integer getSumOfAllFingerlings(@Param("farmId") Long farmId);
}
