package com.cgdms.CGDMS.logs.feed;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface FeedLogRepository extends JpaRepository<FeedLog, Long> {

    Page<FeedLog> findByPond_Id(Long pondId, Pageable pageable);

    Page<FeedLog> findByBatch_Id(Long batchId, Pageable pageable);

    Page<FeedLog> findByDateBetween(LocalDate start, LocalDate end, Pageable pageable);

    // combine filters can be implemented in service with Specification or QueryDSL if needed
}