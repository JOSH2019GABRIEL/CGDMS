package com.cgdms.CGDMS.organization;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
            @Query(value = """
        SELECT org FROM 
        Organization org WHERE org.archived = 0
        AND org.farm.id = :farmId
        """)
    Page<Organization> findAllNotArchived(Pageable pageable, Long farmId);

    @Query(value = """
SELECT org FROM 
Organization org WHERE org.archived = 0
AND org.farm.id = :farmId AND org.operatorUserId = :id
""")
    Page<Organization> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);

    //TODO: write a select for unarchived to for grid Pagination
}
