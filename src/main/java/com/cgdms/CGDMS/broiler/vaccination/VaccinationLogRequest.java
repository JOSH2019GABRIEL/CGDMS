package com.cgdms.CGDMS.broiler.vaccination;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VaccinationLogRequest {
    private Long id;
    private LocalDate date;
    private Long flockId;
    private String vaccineName;
    private String dose;
    private String route;
}
