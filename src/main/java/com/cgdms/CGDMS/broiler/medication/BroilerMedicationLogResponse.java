package com.cgdms.CGDMS.broiler.medication;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BroilerMedicationLogResponse {
    private Long id;
    private LocalDate date;
    private Long flockId;
    private String drug;
    private String dose;
    private String route;
    private Integer withdrawalDays;
    private String fullFlock;
}
