package com.cgdms.CGDMS.logs.feed;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedLogRequest {

    private Long id; // optional for update

    @NotNull(message = "date is required")
    private LocalDate date;

    @NotNull(message = "pondId is required")
    private Long pondId;

    private Long batchId; // optional

    @NotBlank(message = "feedType is required")
    private String feedType;

    private String brand;

    @NotNull(message = "quantityKg is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "quantityKg must be > 0")
    private Double quantityKg;

    private String method;

    private LocalTime timeOfDay;

    private Integer staffId; // optional - maps to Staff id

    @Size(max = 500)
    private String notes;
}
