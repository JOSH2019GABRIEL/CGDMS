package com.cgdms.CGDMS.processing.waste;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WastesRepository extends JpaRepository <Wastes, Long> {

    @Query(value = """
                SELECT wastes 
                FROM Wastes wastes
                WHERE wastes.archived = 0 AND wastes.farm.id = :farmId
                """)
    Page<Wastes> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                SELECT wastes 
                FROM Wastes wastes
                WHERE wastes.archived = 0 AND wastes.farm.id = :farmId AND wastes.operatorUserId = :id
                """)
    Page<Wastes> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}
