package com.cgdms.CGDMS.farm;


import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.organization.Organization;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Farm extends BaseEntity {

    private String farmName;
    private String location;
    private double sizeInHectares;

    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;
}

