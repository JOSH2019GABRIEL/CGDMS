package com.cgdms.CGDMS.vegetables.plots;

import com.cgdms.CGDMS.vegetables.crop.CropVariety;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PlotRepository extends JpaRepository<Plot, Long> {

    @Query(value = """
                SELECT p 
                FROM Plot p
                WHERE p.archived = 0
                """)
    Page<Plot> findAllNotArchived(Pageable pageable);
}
