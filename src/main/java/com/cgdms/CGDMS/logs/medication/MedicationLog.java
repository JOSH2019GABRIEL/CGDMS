package com.cgdms.CGDMS.logs.medication;


import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.batch.Batch;
import com.cgdms.CGDMS.pond.Pond;
import com.cgdms.CGDMS.staff.Staff;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
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
public class MedicationLog extends BaseEntity {

    @Column(nullable = false)
    private LocalDate treatmentDate;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "pond_id", nullable = false)
    private Pond pond;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id")
    private Batch batch;

    @Column(nullable = false)
    private String diagnosis;

    @Column(nullable = false)
    private String medication;

    @Min(0)
    @Column(nullable = false)
    private Double dosage;

    @Column(nullable = false)
    private String dosageUnit;

    @Min(0)
    private Double quantityUsed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TreatmentMethod method;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administered_by_id")
    private User administeredBy;

    @Column(length = 700)
    private String notes;

    @Min(0)
    private Integer withdrawalDays;

//    @Version
//    private Long version;
}
