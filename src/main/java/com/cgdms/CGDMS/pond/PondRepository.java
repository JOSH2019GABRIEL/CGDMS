package com.cgdms.CGDMS.pond;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PondRepository extends JpaRepository<Pond, Long> {


    @Query(value = """
           SELECT pond
           FROM Pond pond
           WHERE pond.archived = 0 AND pond.farm.id = :farmId    
                """)
    Page<Pond> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
           SELECT pond
           FROM Pond pond
           WHERE pond.operatorUserId = :userId 
           AND pond.archived = 0 AND pond.farm.id = :farmId    
                """)
    Page<Pond> findAllNotArchivedForUsers(Pageable pageable, @Param("userId") Integer userId, @Param("farmId") Long farmId);


    @Query(value = """
           SELECT COUNT(pond)
           FROM Pond pond
           WHERE pond.archived = 0 and pond.farm.id = :farmId  
                """)
    Integer findAllCount(Long farmId);

    @Query(value = """
           SELECT SUM(pond.availableFingerlin)
           FROM Pond pond
           WHERE pond.archived = 0 AND pond.farm.id = :farmId 
                """)
    Integer getAvailableFingerlingsInPonds(@Param("farmId") Long farmId);
}