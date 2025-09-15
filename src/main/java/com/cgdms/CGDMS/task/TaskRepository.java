package com.cgdms.CGDMS.task;

import com.cgdms.CGDMS.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToId(Long userId);



    @Query( value = """
            SELECT task
            FROM Task task
            WHERE task.archived = 0
            """
    )
    Page<Task> findAllTask(Pageable pageable);


}