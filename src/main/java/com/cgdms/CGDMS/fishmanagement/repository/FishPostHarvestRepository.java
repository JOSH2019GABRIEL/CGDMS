package com.cgdms.CGDMS.fishmanagement.repository;

import com.cgdms.CGDMS.fishmanagement.entity.PostHarvest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FishPostHarvestRepository extends JpaRepository<PostHarvest, Long> {

    @Query(value = """
                    SELECT ph FROM PostHarvest ph WHERE ph.archived = 0 and ph.farm.id = :farmId
                    """)
    Page<PostHarvest> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                    SELECT ph FROM PostHarvest ph WHERE ph.archived = 0 and ph.farm.id = :farmId AND ph.operatorUserId = :id
                    """)
    Page<PostHarvest> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}
