package com.cgdms.CGDMS.vegetables.plots;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlotResponse {

    private Long id;
    private String type; // greenhouse / open_field
    private Double areaM2;
    private String soilType;
    private String bedLayout;
}
