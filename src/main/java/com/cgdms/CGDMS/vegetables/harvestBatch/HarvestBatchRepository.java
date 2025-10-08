package com.cgdms.CGDMS.vegetables.harvestBatch;

import com.cgdms.CGDMS.vegetables.crop.CropVariety;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface HarvestBatchRepository extends JpaRepository<HarvestBatch, Long> {

    @Query(value = """
                SELECT h 
                FROM HarvestBatch h
                WHERE h.archived = 0
                """)
    Page<HarvestBatch> findAllNotArchived(Pageable pageable);
}
