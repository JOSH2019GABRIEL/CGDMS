package com.cgdms.CGDMS.vegetables.plots;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PlotRepository extends JpaRepository<Plot, Long> {

    @Query(value = """
                SELECT p 
                FROM Plot p
                WHERE p.archived = 0 and p.farm.id = :id
                """)
    Page<Plot> findAllNotArchived(Pageable pageable, Long farmId);
}
