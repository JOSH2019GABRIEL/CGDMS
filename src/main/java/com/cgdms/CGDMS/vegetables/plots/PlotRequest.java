package com.cgdms.CGDMS.vegetables.plots;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PlotRequest {

    private Long id;
    private String type; // greenhouse / open_field
    private Double areaM2;
    private String soilType;
    private String bedLayout;
}
