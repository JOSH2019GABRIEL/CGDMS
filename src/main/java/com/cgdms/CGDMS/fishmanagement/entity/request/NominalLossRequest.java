package com.cgdms.CGDMS.fishmanagement.entity.request;

import com.cgdms.CGDMS.fishmanagement.entity.NominalLoss;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NominalLossRequest {

    private Long id;
    private NominalLoss.Rate rate;
    private String description;
    private Double value;
    private String category;


}
