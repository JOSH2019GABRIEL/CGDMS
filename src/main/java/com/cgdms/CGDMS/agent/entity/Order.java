package com.cgdms.CGDMS.agent.entity;

import com.cgdms.CGDMS.base.BaseEntity;
import com.cgdms.CGDMS.farm.Farm;
import com.cgdms.CGDMS.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;



@Table(name = "orders")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Order extends BaseEntity {


    @Column(unique = true, nullable = false)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    private User agent;

    private String customerName;
    private String customerPhone;

    @Column(columnDefinition = "TEXT")
    private String deliveryAddress;

    private Double totalAmount;

    private Double totalCommission;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING_FULFILLMENT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id")
    private Farm fulfillmentCenterId;

    private LocalDateTime orderDate = LocalDateTime.now();
    private LocalDateTime fulfilledDate;
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    public enum Status {
        PENDING_FULFILLMENT, PROCESSING, DISPATCHED, FULFILLED, CANCELLED
    }
}