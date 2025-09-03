package com.cgdms.CGDMS.logs.medication;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicationLogResponse {

    private Long id;

    private LocalDate treatmentDate;

    private Long pondId;
    private String pondName;

    private Long batchId;

    private String diagnosis;
    private String medication;
    private Double dosage;
    private String dosageUnit;
    private Double quantityUsed;
    private TreatmentMethod method;

    private Integer administeredById;
//    private String administeredByName;

    private String notes;
    private Integer withdrawalDays;
}