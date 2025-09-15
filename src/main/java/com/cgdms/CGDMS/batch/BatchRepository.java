package com.cgdms.CGDMS.batch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {

    @Query(value = """
                SELECT batch 
                FROM Batch batch
                WHERE batch.archived = 0
                """)
    Page<Batch> findAllNotArchived(Pageable pageable);


    @Query(value = """
                SELECT SUM(batch.initialCount) 
                FROM Batch batch
                WHERE batch.archived = 0
                """)
    Integer getSumOfAllFingerlings();
}
