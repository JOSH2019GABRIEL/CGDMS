package com.cgdms.CGDMS.vegetables.saleslink;

import com.cgdms.CGDMS.vegetables.crop.CropVariety;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SalesLinkRepository extends JpaRepository<SalesLink, Long> {

    @Query(value = """
                SELECT s 
                FROM SalesLink s
                WHERE s.archived = 0
                """)
    Page<SalesLink> findAllNotArchived(Pageable pageable);
}
