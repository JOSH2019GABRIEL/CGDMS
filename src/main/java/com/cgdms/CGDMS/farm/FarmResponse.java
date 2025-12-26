package com.cgdms.CGDMS.farm;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FarmResponse {
    private Long id;
//    private String name;
//    private String location;
//    private String organizationName;



    private String farmName;
    private String location;
    private double sizeInHectares;
    private String organizationId;
}