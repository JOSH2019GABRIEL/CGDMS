package com.cgdms.CGDMS.organization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    //TODO: write a select for unarchived to for grid Pagination
}
