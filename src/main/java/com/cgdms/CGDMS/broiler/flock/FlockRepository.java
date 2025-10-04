package com.cgdms.CGDMS.broiler.flock;

import com.cgdms.CGDMS.batch.Batch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FlockRepository extends JpaRepository<Flock, Long> {

//    @Query(value = """
//                SELECT flock
//                FROM Flock flock
//                WHERE flock.archived = 0
//                """)
//    Page<Flock> findAllNotArchived(Pageable pageable);

    @Query("SELECT f FROM Flock f LEFT JOIN FETCH f.farm WHERE f.archived = 0")
    Page<Flock> findAllNotArchived(Pageable pageable);

//    @Query("SELECT f FROM Flock f JOIN FETCH f.farm WHERE f.archived = 0")
//    Page<Flock> findAllNotArchived(Pageable pageable);

}
