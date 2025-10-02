package com.cgdms.CGDMS.processing.byproduct;

import com.cgdms.CGDMS.broiler.medication.MedicationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ByproductRepository extends JpaRepository<Byproduct, Long>{

    @Query(value = """
                SELECT byproduct 
                FROM Byproduct byproduct
                WHERE byproduct.archived = 0
                """)
    Page<Byproduct> findAllNotArchived(Pageable pageable);
}

