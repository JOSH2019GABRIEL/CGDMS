package com.cgdms.CGDMS.logs.env;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface EnvLogRepository extends JpaRepository<EnvLog, Long> {

    Page<EnvLog> findByPond_Id(Long pondId, Pageable pageable);

    Page<EnvLog> findByMeasuredAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    Page<EnvLog> findByPond_IdAndMeasuredAtBetween(Long pondId, LocalDateTime start, LocalDateTime end, Pageable pageable);

    @Query(value = """
                SELECT e 
                FROM EnvLog e
                WHERE e.archived = 0 and e.farm.id = :farmId and e.operatorUserId= :id
                """)
    Page<EnvLog> findAllNotArchivedForUsers(Pageable pageable, Integer id, Long farmId);
    @Query(value = """
                SELECT e 
                FROM EnvLog e
                WHERE e.archived = 0 and e.farm.id = :farmId
                """)
    Page<EnvLog> findAllUnArchived(Pageable pageable, Long farmId);
}
