package com.cgdms.CGDMS.fishmanagement.repository;

import com.cgdms.CGDMS.fishmanagement.entity.SmokingPlantTransferDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SmokingPlantTransferRepository extends JpaRepository<SmokingPlantTransferDetails, Long> {

    @Query(value = """
                    SELECT sm from SmokingPlantTransferDetails sm WHERE sm.archived = 0 and sm.farm.id = :farmId
                    """)
    Page<SmokingPlantTransferDetails> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                    SELECT sm from SmokingPlantTransferDetails sm WHERE sm.archived = 0 and sm.farm.id = :farmId AND sm.operatorUserId = :id
                    """)
    Page<SmokingPlantTransferDetails> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}
