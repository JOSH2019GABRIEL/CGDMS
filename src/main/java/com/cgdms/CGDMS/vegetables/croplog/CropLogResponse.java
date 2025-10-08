package com.cgdms.CGDMS.vegetables.croplog;


import lombok.*;

import java.time.LocalDate;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CropLogResponse {

    private Long id;
    private LocalDate date;
    private String cropStage; // germination, vegetative, flowering, etc.
    private Double irrigationL;
    private Double fertilizerG;
    private String pesticideApplied;
    private Long staffId;

    private Long plotId;
}
