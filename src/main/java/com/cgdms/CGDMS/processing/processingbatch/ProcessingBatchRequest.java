package com.cgdms.CGDMS.processing.processingbatch;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class ProcessingBatchRequest {

    private Long id;
    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Plant location is required")
    private String plantLocation;


    @NotNull(message = "Harvest Event ID is required")
    private Long harvestEventId;
}