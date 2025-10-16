package com.cgdms.CGDMS.vegetables.crop;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CropVarietyRepository extends JpaRepository<CropVariety, Long> {

    @Query(value = """
                SELECT c 
                FROM CropVariety c
                WHERE c.archived = 0 and c.farm.id = :farmId
                """)
    Page<CropVariety> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                SELECT c 
                FROM CropVariety c
                WHERE c.archived = 0 and c.farm.id = :farmId and c.operatorUserId = :id
                """)
    Page<CropVariety> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}
