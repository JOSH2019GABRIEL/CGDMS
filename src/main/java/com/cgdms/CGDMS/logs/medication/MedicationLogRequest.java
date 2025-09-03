package com.cgdms.CGDMS.logs.medication;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicationLogRequest {

    private Long id; // present for update; null for create

    @NotNull(message = "treatmentDate is required")
    private LocalDate treatmentDate;

    @NotNull(message = "pondId is required")
    private Long pondId;

    private Long batchId; // optional

    @NotBlank(message = "diagnosis is required")
    private String diagnosis;

    @NotBlank(message = "medication is required")
    private String medication;

    @NotNull(message = "dosage is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "dosage must be > 0")
    private Double dosage;

    @NotBlank(message = "dosageUnit is required")
    private String dosageUnit;

    @DecimalMin(value = "0.0", inclusive = true, message = "quantityUsed must be >= 0")
    private Double quantityUsed;

    @NotNull(message = "method is required")
    private TreatmentMethod method;

    private Integer administeredById; // optional

    @Size(max = 700)
    private String notes;

    @Min(value = 0, message = "withdrawalDays must be >= 0")
    private Integer withdrawalDays;
}
