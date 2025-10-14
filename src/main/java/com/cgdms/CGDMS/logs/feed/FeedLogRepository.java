package com.cgdms.CGDMS.logs.feed;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface FeedLogRepository extends JpaRepository<FeedLog, Long> {

    Page<FeedLog> findByPond_Id(Long pondId, Pageable pageable);

    Page<FeedLog> findByBatch_Id(Long batchId, Pageable pageable);

    Page<FeedLog> findByDateBetween(LocalDate start, LocalDate end, Pageable pageable);

    @Query(value = """
                SELECT f
                FROM FeedLog f
                WHERE f.archived = 0 and f.farm.id = :farmId and f.operatorUserId= :id
                """)
    Page<FeedLog> findAllNotArchivedForUsers(Pageable pageable, Integer id, Long farmId);

    @Query(value = """
                SELECT f
                FROM FeedLog f
                WHERE f.archived = 0 and f.farm.id = :farmId
                """)
    Page<FeedLog> findAllNotArchived(Pageable pageable, Long farmId);
}