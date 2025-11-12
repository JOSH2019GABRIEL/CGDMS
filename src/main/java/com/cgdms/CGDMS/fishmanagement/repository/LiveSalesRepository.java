package com.cgdms.CGDMS.fishmanagement.repository;

import com.cgdms.CGDMS.fishmanagement.entity.LiveSalesDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LiveSalesRepository extends JpaRepository<LiveSalesDetails, Long> {

    @Query(value = """
                    SELECT ls FROM LiveSalesDetails ls WHERE ls.archived = 0 AND ls.farm.id = :farmId
                    """)
    Page<LiveSalesDetails> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
                    SELECT ls FROM LiveSalesDetails ls WHERE ls.archived = 0 AND ls.farm.id = :farmId AND ls.operatorUserId = :id
                    """)
    Page<LiveSalesDetails> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}
