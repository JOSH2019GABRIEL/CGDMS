package com.cgdms.CGDMS.batch;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BatchResponse {
    private Long id;
    private String pondName;
    private String source;
    private LocalDate stockDate;
    private Double initialAvgWeightG;
    private Integer initialCount;
//    private String createdBy;
//    private LocalDateTime createdDate;
}
