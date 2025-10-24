package com.cgdms.CGDMS.performance;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class PerformanceResponse {
    private Long id;
    private LocalDate date;
    private Long pondId;
    private String pondName;
    private Long batchId;
    private Double avgWeightG;
    private Integer liveCount;
    private Double biomassKg;
    private Integer archived;

}
