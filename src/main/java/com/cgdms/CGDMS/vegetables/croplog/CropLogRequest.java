package com.cgdms.CGDMS.vegetables.croplog;

import com.cgdms.CGDMS.vegetables.plots.Plot;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class CropLogRequest {

    private Long id;
    private LocalDate date;
    private String cropStage; // germination, vegetative, flowering, etc.
    private Double irrigationL;
    private Double fertilizerG;
    private String pesticideApplied;
    private Long staffId;

    private Long plotId;
}
