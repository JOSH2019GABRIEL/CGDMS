package com.cgdms.CGDMS.broiler.flock;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FlockRequest {
    private Long id;
    private Long houseId;
    private String source;
    private LocalDate hatchDate;
    private Integer stockingCount;
    private String sexRatio;
    private Integer expectedCycleDays;
    private Double targetWeight;
    private String vaccineProfile;
    private Long farmId;
}
