package com.cgdms.CGDMS.vegetables.plots;

import com.cgdms.CGDMS.base.BaseEntity;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Plot extends BaseEntity {
    private String type; // greenhouse / open_field
    private Double areaM2;
    private String soilType;
    private String bedLayout;
}