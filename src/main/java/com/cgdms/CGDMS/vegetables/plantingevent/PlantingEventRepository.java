package com.cgdms.CGDMS.vegetables.plantingevent;

import com.cgdms.CGDMS.vegetables.crop.CropVariety;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PlantingEventRepository extends JpaRepository<PlantingEvent, Long> {

    @Query(value = """
                SELECT p
                FROM PlantingEvent p
                WHERE p.archived = 0
                """)
    Page<PlantingEvent> findAllNotArchived(Pageable pageable);
}
