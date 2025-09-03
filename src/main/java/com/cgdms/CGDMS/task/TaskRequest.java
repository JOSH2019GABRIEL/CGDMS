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
public class TaskRequest {
    private String title;
    private String description;
    private LocalDate dueDate;
    private Integer assignedToId;
    private String assignedBy;
}