package com.cgdms.CGDMS.broiler.dailybroilerlogs;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DailyBroilerLogRequest {
    private Long id;
    private LocalDate date;
    private Long flockId;
    private String feedType;
    private Double feedQtyKg;
    private String waterCheck;
    private Double temp;
    private Integer mortalityCount;
    private String notes;
}

