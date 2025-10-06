package com.cgdms.CGDMS.broiler.harvest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface HarvestEventRepository extends JpaRepository<HarvestEvent, Long> {

    @Query(value = """
                SELECT h 
                FROM HarvestEvent h
                WHERE h.archived = 0
                """)
    Page<HarvestEvent> findAllNotArchived(Pageable pageable);
}
