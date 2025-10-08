package com.cgdms.CGDMS.vegetables.croplog;

import com.cgdms.CGDMS.vegetables.crop.CropVariety;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CropLogRepository extends JpaRepository<CropLog, Long> {

    @Query(value = """
                SELECT c 
                FROM CropLog c
                WHERE c.archived = 0
                """)
    Page<CropLog> findAllNotArchived(Pageable pageable);
}
