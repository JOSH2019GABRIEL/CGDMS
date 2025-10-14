package com.cgdms.CGDMS.logs.medication;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;

public interface MedicationLogRepository extends JpaRepository<MedicationLog, Long> {

    Page<MedicationLog> findByPond_Id(Long pondId, Pageable pageable);

    Page<MedicationLog> findByBatch_Id(Long batchId, Pageable pageable);

    Page<MedicationLog> findByTreatmentDateBetween(LocalDate start, LocalDate end, Pageable pageable);

    Page<MedicationLog> findByDiagnosisContainingIgnoreCase(String diagnosis, Pageable pageable);

    Page<MedicationLog> findByMedicationContainingIgnoreCase(String medication, Pageable pageable);

    @Query(value = """
                SELECT m
                FROM MedicationLog m
                WHERE m.archived = 0 and m.farm.id = :farmId and
                m.operatorUserId = :id
                """)
    Page<MedicationLog> findAllNotArchivedForUsers(Pageable pageable, Integer id, Long farmId);

    @Query(value = """
                SELECT m
                FROM MedicationLog m
                WHERE m.archived = 0 and m.farm.id = :farmId
                """)
    Page<MedicationLog> findAllNotArchived(Pageable pageable, Long farmId);
}
