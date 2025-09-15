package com.cgdms.CGDMS.performance;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PerformanceRequest {
    private LocalDate date;
    private Long pondId;
    private Long batchId;
    private Double avgWeightG;
    private Integer liveCount;
}
