package com.cgdms.CGDMS.agent.repository;

import com.cgdms.CGDMS.agent.entity.CommissionScheme;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CommissionSchemeRepository extends JpaRepository<CommissionScheme, Long> {

    Optional<Object> findBySchemeName(String schemeName);

    @Query(value = """
                    SELECT ch FROM CommissionScheme ch WHERE ch.archived = 0 AND ch.farm.id = :farmId
                    """)
    Page<CommissionScheme> findAllNotArchived(Pageable pageable, Long farmId);
    @Query(value = """
                    SELECT ch FROM CommissionScheme ch WHERE ch.archived = 0 AND ch.farm.id = :farmId AND ch.operatorUserId = :id
                    """)
    Page<CommissionScheme> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);

//    Optional<CommissionScheme> findBySchemeName(String schemeName);

//    List<CommissionScheme> findByIsActiveTrue();
}