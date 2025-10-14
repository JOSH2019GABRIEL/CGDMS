package com.cgdms.CGDMS.broiler.vaccination;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VaccinationLogRepository extends JpaRepository<VaccinationLog, Long> {

    @Query(value = """
                SELECT vaccination 
                FROM VaccinationLog vaccination
                WHERE vaccination.archived = 0 AND vaccination.farm.id=:farmId
                """)
    Page<VaccinationLog> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                SELECT vaccination 
                FROM VaccinationLog vaccination
                WHERE vaccination.archived = 0 AND vaccination.farm.id=:farmId and
                vaccination.operatorUserId= :id
                """)
    Page<VaccinationLog> findAllNotArchivedForUsers(Pageable pageable, Integer id, Long farmId);
}
