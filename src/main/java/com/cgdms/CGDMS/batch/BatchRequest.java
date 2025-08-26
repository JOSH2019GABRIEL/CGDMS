package com.cgdms.CGDMS.batch;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BatchRequest {
    private Long id;
    private Long pondId;
    private String source;
    private LocalDate stockDate;
    private Double initialAvgWeightG;
    private Integer initialCount;
}
