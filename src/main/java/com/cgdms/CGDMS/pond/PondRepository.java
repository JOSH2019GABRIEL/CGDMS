package com.cgdms.CGDMS.pond;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PondRepository extends JpaRepository<Pond, Long> {


    @Query(value = """
           SELECT pond
           FROM Pond pond
           WHERE pond.archived = 0     
                """)
    Page<Pond> findAllNotArchived(Pageable pageable);


    @Query(value = """
           SELECT COUNT(pond)
           FROM Pond pond
           WHERE pond.archived = 0     
                """)
    Integer findAllCount();

    @Query(value = """
           SELECT SUM(pond.availableFingerlin)
           FROM Pond pond
           WHERE pond.archived = 0     
                """)
    Integer getAvailableFingerlingsInPonds();
}