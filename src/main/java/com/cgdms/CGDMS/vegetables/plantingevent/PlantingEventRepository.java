package com.cgdms.CGDMS.vegetables.plantingevent;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PlantingEventRepository extends JpaRepository<PlantingEvent, Long> {

    @Query(value = """
                SELECT p
                FROM PlantingEvent p
                WHERE p.archived = 0 and p.farm.id = :farmId
                """)
    Page<PlantingEvent> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                SELECT p
                FROM PlantingEvent p
                WHERE p.archived = 0 and p.farm.id = :farmId and p.operatorUserId = :id
                """)
    Page<PlantingEvent> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}
