package com.cgdms.CGDMS.processing.processingbatch;


import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProcessingBatchResponse {

    private Long id;
    private LocalDate date;
    private String plantLocation;
    private String operator;

    private Long harvestEventId;
    private String harvestEventName; // optional: could be flock or event description
}