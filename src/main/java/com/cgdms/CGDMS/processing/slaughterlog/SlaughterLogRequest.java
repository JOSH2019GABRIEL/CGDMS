package com.cgdms.CGDMS.processing.slaughterlog;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SlaughterLogRequest {

    private Long id;

    @NotNull(message = "Birds received is required")
    private Integer birdsReceived;

    @NotNull(message = "Birds slaughtered is required")
    private Integer birdsSlaughtered;

    private Integer condemnedCount;

    private String reason;

    @NotNull(message = "Processing Batch ID is required")
    private Long processId;
}
