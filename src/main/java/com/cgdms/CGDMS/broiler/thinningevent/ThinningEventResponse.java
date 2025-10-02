package com.cgdms.CGDMS.broiler.thinningevent;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ThinningEventResponse {
    private Long id;
    private LocalDate date;
    private Long flockId;
    private Integer numberRemoved;
    private Double averageWeight;
    private String destination;
}
