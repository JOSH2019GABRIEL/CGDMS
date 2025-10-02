package com.cgdms.CGDMS.broiler.vaccination;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VaccinationLogRepository extends JpaRepository<VaccinationLog, Long> {

    @Query(value = """
                SELECT vaccination 
                FROM VaccinationLog vaccination
                WHERE vaccination.archived = 0
                """)
    Page<VaccinationLog> findAllNotArchived(Pageable pageable);
}
