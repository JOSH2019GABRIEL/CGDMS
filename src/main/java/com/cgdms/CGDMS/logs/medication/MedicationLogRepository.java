package com.cgdms.CGDMS.logs.medication;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface MedicationLogRepository extends JpaRepository<MedicationLog, Long> {

    Page<MedicationLog> findByPond_Id(Long pondId, Pageable pageable);

    Page<MedicationLog> findByBatch_Id(Long batchId, Pageable pageable);

    Page<MedicationLog> findByTreatmentDateBetween(LocalDate start, LocalDate end, Pageable pageable);

    Page<MedicationLog> findByDiagnosisContainingIgnoreCase(String diagnosis, Pageable pageable);

    Page<MedicationLog> findByMedicationContainingIgnoreCase(String medication, Pageable pageable);
}
