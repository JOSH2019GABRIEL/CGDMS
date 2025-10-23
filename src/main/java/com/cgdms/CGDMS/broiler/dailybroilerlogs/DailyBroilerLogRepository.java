package com.cgdms.CGDMS.broiler.dailybroilerlogs;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DailyBroilerLogRepository extends JpaRepository<DailyBroilerLog, Long> {

    @Query(value = """
                SELECT dailyBroilerLog
                FROM DailyBroilerLog dailyBroilerLog
                WHERE dailyBroilerLog.archived = 0 AND dailyBroilerLog.farm.id = :farmId
                """)
    Page<DailyBroilerLog> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                SELECT dailyBroilerLog
                FROM DailyBroilerLog dailyBroilerLog
                WHERE dailyBroilerLog.archived = 0 AND dailyBroilerLog.farm.id = :farmId
                AND dailyBroilerLog.operatorUserId = :userId
                """)
    Page<DailyBroilerLog> findAllNotArchivedForUsers(Pageable pageable, Integer userId, Long farmId);
}
