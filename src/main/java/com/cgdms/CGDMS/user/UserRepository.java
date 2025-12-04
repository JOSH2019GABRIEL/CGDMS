package com.cgdms.CGDMS.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail (String email);

    @Query( value = """
            SELECT users
            FROM User users
            WHERE users.archived = 0 and users.farm.id = :farmId
            """
    )
    Page<User> findAllUsers(Pageable pageable, Long farmId);

    @Query("""
    SELECT COUNT(u)
    FROM User u
    WHERE u.archived = 0 and u.farm.id = :farmId
""")
    Integer findAllCount(Long farmId);


    @Query( value = """
            SELECT users
            FROM User users
            WHERE users.archived = 0 and users.farm.id = :farmId AND users.id = :id
            """
    )
    Page<User> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);

    @Query( value = """
            SELECT users
            FROM User users
            WHERE users.archived = 0 and users.farm.id = :farmId AND users.role.name ilike '%AGENT%'
            """
    )
    Page<User> findAllAgent(Pageable pageable, Long farmId);
}
