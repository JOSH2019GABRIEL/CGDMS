package com.cgdms.CGDMS.fishmanagement.entity.response;

import com.cgdms.CGDMS.fishmanagement.entity.NominalLoss;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NominalLossResponse {

    private Long id;
    private NominalLoss.Rate rate;
    private String description;
    private Double value;
}
