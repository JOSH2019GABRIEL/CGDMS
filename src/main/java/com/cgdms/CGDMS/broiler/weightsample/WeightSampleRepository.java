package com.cgdms.CGDMS.broiler.weightsample;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WeightSampleRepository extends JpaRepository<WeightSample, Long> {

    @Query(value = """
                SELECT weightsample 
                FROM WeightSample weightsample
                WHERE weightsample.archived = 0 and weightsample.farm.id = :farmId
                """)
    Page<WeightSample> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                SELECT weightsample 
                FROM WeightSample weightsample
                WHERE weightsample.archived = 0 AND weightsample.operatorUserId = :id and weightsample.farm.id = :farmId
                """)
    Page<WeightSample> findAllNotArchivedForUsers(Pageable pageable, Integer id, Long farmId);
}
