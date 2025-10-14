package com.cgdms.CGDMS.processing.cutupyield;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CutupYieldRepository extends JpaRepository<CutupYield, Long> {

    @Query(value = """
                SELECT cutupyield 
                FROM CutupYield cutupyield
                WHERE cutupyield.archived = 0 and cutupyield.farm.id =:farmId
                """)
    Page<CutupYield> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                SELECT cutupyield 
                FROM CutupYield cutupyield
                WHERE cutupyield.archived = 0 and cutupyield.farm.id = :farmId AND cutupyield.operatorUserId =:id
                """)
    Page<CutupYield> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}
