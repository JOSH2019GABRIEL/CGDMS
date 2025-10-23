package com.cgdms.CGDMS.broiler.flock;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FlockRepository extends JpaRepository<Flock, Long> {

    @Query("SELECT f FROM Flock f LEFT JOIN FETCH f.farm WHERE f.archived = 0 AND f.farm.id= :farmId")
    Page<Flock> findAllNotArchived(Pageable pageable, Long farmId);

    @Query("""
            SELECT f FROM Flock f
            WHERE f.archived = 0
            AND f.farm.id = :farmId
            AND f.operatorUserId= :userId
            
            """)
    Page<Flock> findAllNotArchivedForUsers(Pageable pageable, Integer userId, Long farmId);

//    @Query("SELECT f FROM Flock f JOIN FETCH f.farm WHERE f.archived = 0")
//    Page<Flock> findAllNotArchived(Pageable pageable);

}
