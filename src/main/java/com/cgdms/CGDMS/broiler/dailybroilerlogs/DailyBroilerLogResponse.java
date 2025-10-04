package com.cgdms.CGDMS.broiler.dailybroilerlogs;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DailyBroilerLogResponse {
    private Long id;
    private LocalDate date;
    private Long flockId;
    private String flockSource;
    private String fullFlock;
    private String feedType;
    private Double feedQtyKg;
    private String waterCheck;
    private Double temp;
    private Integer mortalityCount;
    private String notes;
    private Long staffId;
}
