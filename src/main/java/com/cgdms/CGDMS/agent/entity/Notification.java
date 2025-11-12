package com.cgdms.CGDMS.agent.entity;

import com.cgdms.CGDMS.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Table(name = "notifications")
public class Notification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Enumerated(EnumType.STRING)
    private RecipientType recipientType;

    private String recipientEmail;
    private String recipientPhone;

    @Enumerated(EnumType.STRING)
    private Type type;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private LocalDateTime sentAt;

    @Column(columnDefinition = "TEXT")
    private String payload;

    public enum RecipientType {
        AGENT, FULFILLMENT_CENTER
    }

    public enum Type {
        ORDER_CREATED, ORDER_DISPATCHED, ORDER_FULFILLED
    }

    public enum Status {
        PENDING, SENT, FAILED
    }
}
