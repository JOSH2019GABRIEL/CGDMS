package com.cgdms.CGDMS.vegetables.postharvestloss;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PostharvestLossRepository extends JpaRepository<PostharvestLoss, Long> {

    @Query(value = """
                SELECT p 
                FROM PostharvestLoss p
                WHERE p.archived = 0
                """)
    Page<PostharvestLoss> findAllNotArchived(Pageable pageable);
}
