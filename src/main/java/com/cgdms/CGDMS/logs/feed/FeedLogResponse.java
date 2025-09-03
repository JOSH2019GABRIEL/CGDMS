package com.cgdms.CGDMS.logs.feed;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedLogResponse {
    private Long id;
    private LocalDate date;
    private Long pondId;
    private String pondName;
    private Long batchId;
    private String feedType;
    private String brand;
    private Double quantityKg;
    private String method;
    private LocalTime timeOfDay;
    private Integer staffId;
    private String staffName;
    private String notes;
}
