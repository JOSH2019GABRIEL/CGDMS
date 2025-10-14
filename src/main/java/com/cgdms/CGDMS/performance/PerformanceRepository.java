package com.cgdms.CGDMS.performance;

import io.micrometer.observation.ObservationFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PerformanceRepository extends JpaRepository<Performance, Long> {

    @Query(value = """
                SELECT p
                FROM Performance p
                WHERE p.archived = 0 and p.farm.id = :farmId and
                p.operatorUserId = :id
                """)
    Page<Performance> findAllNotArchivedForUsers (Pageable pageable, @Param("farmId") Long farmId, @Param("id") Integer id);

    @Query(value = """
                SELECT p
                FROM Performance p
                WHERE p.archived = 0 and p.farm.id = :farmId
                """)
    Page<Performance> findAllNotArchived (Pageable pageable, @Param("farmId") Long farmId);
}

