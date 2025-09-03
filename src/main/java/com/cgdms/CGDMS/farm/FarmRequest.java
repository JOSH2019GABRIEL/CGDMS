package com.cgdms.CGDMS.farm;

import lombok.Data;

@Data
public class FarmRequest {

    private String farmName;
    private String location;
    private double sizeInHectares;
    private Long organizationId;
}
