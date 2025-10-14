package com.cgdms.CGDMS.broiler.medication;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BroilerMedicationLogRepository extends JpaRepository<BroilerMedicationLog, Long> {

    @Query(value = """
                SELECT medication 
                FROM BroilerMedicationLog medication
                WHERE medication.archived = 0 AND medication.farm.id = :farmId
                """)
    Page<BroilerMedicationLog> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                SELECT medication 
                FROM BroilerMedicationLog medication
                WHERE medication.archived = 0
                AND medication.farm.id =:farmId
                AND medication.operatorUserId= :id
                """)
    Page<BroilerMedicationLog> findAllNotArchivedForUsers(Pageable pageable, Integer id, Long farmId);
}
