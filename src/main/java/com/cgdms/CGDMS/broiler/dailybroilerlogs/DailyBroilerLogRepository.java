package com.cgdms.CGDMS.broiler.dailybroilerlogs;

import com.cgdms.CGDMS.batch.Batch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DailyBroilerLogRepository extends JpaRepository<DailyBroilerLog, Long> {

    @Query(value = """
                SELECT dailyBroilerLog 
                FROM DailyBroilerLog dailyBroilerLog
                WHERE dailyBroilerLog.archived = 0
                """)
    Page<DailyBroilerLog> findAllNotArchived(Pageable pageable);
}
