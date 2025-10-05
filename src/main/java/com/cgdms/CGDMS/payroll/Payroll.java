package com.cgdms.CGDMS.payroll;

import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.cadre.Cadre;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "payrolls")
public class Payroll extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "staff_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cadre_id")
    private Cadre cadre;

    private LocalDate startDate;
    private LocalDate endDate;

    private Integer daysWorked;
    private Integer hoursWorked;

    private Double grossPay;     // before deductions
    private Double deductions;   // total deductions
    private Double bonus;        // total bonuses
    private Double netPay;       // final amount paid

    private Boolean isApproved = false;
    private Boolean isPaid = false;

    private String paymentReference;
}