package com.cgdms.CGDMS.logs.env;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface EnvLogRepository extends JpaRepository<EnvLog, Long> {

    Page<EnvLog> findByPond_Id(Long pondId, Pageable pageable);

    Page<EnvLog> findByMeasuredAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    Page<EnvLog> findByPond_IdAndMeasuredAtBetween(Long pondId, LocalDateTime start, LocalDateTime end, Pageable pageable);
}
