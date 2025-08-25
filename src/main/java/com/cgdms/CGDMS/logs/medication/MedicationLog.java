package com.cgdms.CGDMS.logs.medication;


import com.cgdms.CGDMS.batch.Batch;
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
public class MedicationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    @ManyToOne
    private Pond pond;
    @ManyToOne
    private Batch batch;
    private String diagnosis;
    private String drug;
    private String dose;
    private String adminMethod;
    @ManyToOne
    private Staff staff;
}
