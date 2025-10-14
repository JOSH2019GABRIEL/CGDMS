package com.cgdms.CGDMS.task;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToId(Long userId);



    @Query( value = """
            SELECT task
            FROM Task task
            WHERE task.archived = 0 and task.farm.id = :farmId
            """
    )
    Page<Task> findAllTask(Pageable pageable, Long farmId);


    @Query( value = """
            SELECT task
            FROM Task task
            WHERE task.archived = 0 and task.farm.id = :farmId AND task.operatorUserId = :id
            """
    )
    Page<Task> findAllNotArchivedForUsers(Pageable pageable, Long farmId, Integer id);
}