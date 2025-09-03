package com.cgdms.CGDMS.organization;

import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.farm.Farm;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Organization extends BaseEntity {

    private String name;
    private String address;
    private String contactEmail;
    private String contactPhone;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Farm> farms;
}
