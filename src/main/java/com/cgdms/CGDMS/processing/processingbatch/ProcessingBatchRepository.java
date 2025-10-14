package com.cgdms.CGDMS.processing.processingbatch;

import com.cgdms.CGDMS.processing.cutupyield.CutupYield;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProcessingBatchRepository extends JpaRepository<ProcessingBatch, Long> {

    @Query(value = """
                SELECT processingBatch 
                FROM ProcessingBatch processingBatch
                WHERE processingBatch.archived = 0 and processingBatch.farm.id = :farmId
                """)
    Page<ProcessingBatch> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                SELECT processingBatch 
                FROM ProcessingBatch processingBatch
                WHERE processingBatch.archived = 0 and processingBatch.farm.id = :farmId and processingBatch.operatorUserId = :id
                """)
    Page<ProcessingBatch> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}
