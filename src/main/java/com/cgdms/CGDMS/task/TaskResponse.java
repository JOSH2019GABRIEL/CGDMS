package com.cgdms.CGDMS.task;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private Integer assignedTo;
    private String assignedToName;
    private Integer createdBy;
    private String createdByName;
    private Integer archived;
}