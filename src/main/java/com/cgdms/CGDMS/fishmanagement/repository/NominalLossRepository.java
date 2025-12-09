package com.cgdms.CGDMS.fishmanagement.repository;

import com.cgdms.CGDMS.fishmanagement.entity.NominalLoss;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface NominalLossRepository extends JpaRepository<NominalLoss, Long> {

    @Query(value = """
            SELECT nom FROM NominalLoss nom WHERE nom.archived = 0 AND nom.farm.id = :farmId
            """)
    Page<NominalLoss> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
            SELECT nom FROM NominalLoss nom WHERE nom.archived = 0 AND nom.farm.id = :farmId AND nom.operatorUserId = :id
            """)
    Page<NominalLoss> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}
