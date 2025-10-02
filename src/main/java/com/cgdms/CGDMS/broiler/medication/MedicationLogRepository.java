package com.cgdms.CGDMS.broiler.medication;

import com.cgdms.CGDMS.broiler.vaccination.VaccinationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MedicationLogRepository extends JpaRepository<MedicationLog, Long> {

    @Query(value = """
                SELECT medication 
                FROM MedicationLog medication
                WHERE medication.archived = 0
                """)
    Page<MedicationLog> findAllNotArchived(Pageable pageable);
}
