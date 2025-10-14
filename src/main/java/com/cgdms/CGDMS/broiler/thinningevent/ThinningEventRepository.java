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
                WHERE e.archived = 0 AND e.farm.id= :farmId
                """)
    Page<ThinningEvent> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                SELECT e 
                FROM ThinningEvent e
                WHERE e.archived = 0 AND e.farm.id= :farmId AND e.operatorUserId = :id
                """)
    Page<ThinningEvent> findAllNotArchivedForUsers(Pageable pageable, Integer id, Long farmId);
}
