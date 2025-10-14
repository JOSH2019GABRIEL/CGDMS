package com.cgdms.CGDMS.vegetables.saleslink;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SalesLinkRepository extends JpaRepository<SalesLink, Long> {

    @Query(value = """
                SELECT s 
                FROM SalesLink s
                WHERE s.archived = 0 and s.farm.id = :farmId
                """)
    Page<SalesLink> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                SELECT s 
                FROM SalesLink s
                WHERE s.archived = 0 and s.farm.id = :farmId and s.operatorUserId = :id
                """)
    Page<SalesLink> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}
