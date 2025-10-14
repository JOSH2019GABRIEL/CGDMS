package com.cgdms.CGDMS.vegetables.harvestBatch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface HarvestBatchRepository extends JpaRepository<HarvestBatch, Long> {

    @Query(value = """
                SELECT h 
                FROM HarvestBatch h
                WHERE h.archived = 0 and h.farm.id = :farmId
                """)
    Page<HarvestBatch> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                SELECT h 
                FROM HarvestBatch h
                WHERE h.archived = 0 and h.farm.id = :farmId and h.operatorUserId = :id
                """)
    Page<HarvestBatch> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}
