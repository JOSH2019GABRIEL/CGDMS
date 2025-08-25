package com.cgdms.CGDMS.loe;


import com.cgdms.CGDMS.pond.Pond;
import com.cgdms.CGDMS.staff.Staff;
import jakarta.persistence.*;
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
public class StaffTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    @ManyToOne
    private Staff staff;
    private String cadre;
    private String taskType;
    private Double hours;
    @ManyToOne private Pond pond;
    private String notes;
}
