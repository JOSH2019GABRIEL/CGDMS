package com.cgdms.CGDMS.broiler.weightsample;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WeightSampleRepository extends JpaRepository<WeightSample, Long> {

    @Query(value = """
                SELECT weightsample 
                FROM WeightSample weightsample
                WHERE weightsample.archived = 0
                """)
    Page<WeightSample> findAllNotArchived(Pageable pageable);
}
