package com.cgdms.CGDMS.agent.entity;

import com.cgdms.CGDMS.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Table(name = "commission_schemes")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class CommissionScheme extends BaseEntity {


    @Column(nullable = false, unique = true)
    private String schemeName;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Boolean isActive = true;

    @OneToMany(mappedBy = "commissionScheme", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommissionSchemeRule> rules;
}