package com.cgdms.CGDMS.agent.entity;

import com.cgdms.CGDMS.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;


@Table(name = "fulfillment_events")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class FulfillmentEvent extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private String orderNumber;
    @Enumerated(EnumType.STRING)
    private Order.Status status;

    @Column(columnDefinition = "TEXT")
    private String note;

    private String email;
    private String centerName;
    private LocalDateTime createdTime;
    private LocalDateTime processingTime;
    private String dispatchStatus;
    private LocalDateTime dispatchTime;
    private LocalDateTime fulfillmentTime;
}