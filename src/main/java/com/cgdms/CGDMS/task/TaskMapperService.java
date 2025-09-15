package com.cgdms.CGDMS.task;

import org.springframework.stereotype.Service;

@Service
public class TaskMapperService {

    public TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .assignedTo(task.getAssignedTo() != null ? task.getAssignedTo().getId() : null)
                .assignedToName(task.getAssignedTo() != null ? task.getAssignedTo().fullName() : null)
                .createdBy(task.getAssignedBy() != null ? task.getAssignedBy().getId() : null)
                .createdByName(task.getAssignedBy() != null ? task.getAssignedBy().fullName() : null)
                .archived(task.getArchived())
                .build();
    }


}
