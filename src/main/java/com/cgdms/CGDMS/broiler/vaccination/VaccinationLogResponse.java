package com.cgdms.CGDMS.broiler.vaccination;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VaccinationLogResponse {
    private Long id;
    private LocalDate date;
    private Long flockId;
    private String vaccineName;
    private String dose;
    private String route;
    private String fullFlock;
}
