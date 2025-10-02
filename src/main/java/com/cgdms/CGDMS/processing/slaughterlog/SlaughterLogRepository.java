package com.cgdms.CGDMS.processing.slaughterlog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SlaughterLogRepository extends JpaRepository <SlaughterLog, Long> {

    @Query(value = """
                SELECT slaughterlog 
                FROM SlaughterLog slaughterlog
                WHERE slaughterlog.archived = 0
                """)
    Page<SlaughterLog> findAllNotArchived(Pageable pageable);


}
