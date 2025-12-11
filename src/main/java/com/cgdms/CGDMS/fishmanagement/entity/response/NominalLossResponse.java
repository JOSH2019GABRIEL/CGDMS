package com.cgdms.CGDMS.fishmanagement.entity.response;

import com.cgdms.CGDMS.fishmanagement.entity.NominalLoss;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NominalLossResponse {

    private Long id;
    private String rate;
    private String description;
    private String category;
    private Double value;
}
