package com.cgdms.CGDMS.broiler.thinningevent;

import com.cgdms.CGDMS.broiler.vaccination.VaccinationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ThinningEventRepository extends JpaRepository<ThinningEvent, Long> {

    @Query(value = """
                SELECT e 
                FROM ThinningEvent e
                WHERE e.archived = 0
                """)
    Page<ThinningEvent> findAllNotArchived(Pageable pageable);
}
