package com.cgdms.CGDMS.vegetables.postharvestloss;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PostharvestLossRepository extends JpaRepository<PostharvestLoss, Long> {

    @Query(value = """
                SELECT p 
                FROM PostharvestLoss p
                WHERE p.archived = 0 and p.farm.id = :farmId
                """)
    Page<PostharvestLoss> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                SELECT p 
                FROM PostharvestLoss p
                WHERE p.archived = 0 and p.farm.id = :farmId and p.operatorUserId = :id
                """)
    Page<PostharvestLoss> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}
