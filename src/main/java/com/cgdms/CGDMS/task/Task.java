package com.cgdms.CGDMS.task;

import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Task extends BaseEntity {

    private String title;
    private String description;

    private LocalDate dueDate;

    private Integer archived = 1;

    @ManyToOne
    @JoinColumn(name = "assigned_to_user")
    private User assignedTo;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User assignedBy;
}
