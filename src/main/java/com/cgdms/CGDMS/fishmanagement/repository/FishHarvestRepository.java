package com.cgdms.CGDMS.fishmanagement.repository;

import com.cgdms.CGDMS.fishmanagement.entity.FishHarvest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FishHarvestRepository extends JpaRepository<FishHarvest, Long> {

    @Query(value = """
                    SELECT fh
                    FROM FishHarvest fh
                    WHERE fh.archived = 0 AND fh.farm.id = :farmId
                    """)
    Page<FishHarvest> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                    SELECT fh
                    FROM FishHarvest fh
                    WHERE fh.archived = 0 AND fh.farm.id = :farmId AND fh.operatorUserId = :id
                    """)
    Page<FishHarvest> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}
