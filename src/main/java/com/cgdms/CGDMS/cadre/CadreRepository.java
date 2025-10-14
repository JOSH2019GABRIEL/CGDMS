package com.cgdms.CGDMS.cadre;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CadreRepository extends JpaRepository<Cadre, Long> {

    @Query("SELECT c FROM Cadre c WHERE c.archived = 0 and c.farm.id = :farmId")
    Page<Cadre> findAllNotArchived(Pageable pageable, Long farmId);

    boolean existsByCadreNameIgnoreCase(String name);

    Optional<Cadre> findByCadreName(String generalStaff);
}