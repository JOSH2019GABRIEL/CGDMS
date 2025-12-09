package com.cgdms.CGDMS.fishmanagement.entity;

import com.cgdms.CGDMS.agent.entity.CommissionSchemeRule;
import com.cgdms.CGDMS.base.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Table(name = "nominal_loss")
public class NominalLoss extends BaseEntity {


    private Double value;
    private String description;

    @Enumerated(EnumType.STRING)
    private Rate rate;
    public enum Rate {
        PER_UNIT, PERCENTAGE
    }


}
