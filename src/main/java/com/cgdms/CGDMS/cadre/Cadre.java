package com.cgdms.CGDMS.cadre;

import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.farm.Farm;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.function.DoubleToLongFunction;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "cadres")
public class Cadre extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String cadreName;  // e.g., "Farm Attendant", "Supervisor"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentType paymentType;  // HOURLY, DAILY, MONTHLY

    @Column(nullable = false)
    private Double rate;  // Amount based on paymentType

    @Column(length = 255)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farm_id")
    private Farm farm;

//    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @JoinColumn(name = "user_id")
//    private User user;
}

