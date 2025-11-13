package com.cgdms.CGDMS.fishmanagement.entity;


import com.cgdms.CGDMS.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Table(name = "live_sales_details")
public class LiveSalesDetails extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    private PostHarvest postHarvestDestination;

    @Column(name = "buyer_name", length = 150, nullable = false)
    private String buyerName;

    @Column(name = "sale_price_per_kg", nullable = false)
    private Double salePricePerKg;

    private Integer quantitySale;

    @Column(name = "total_sale_value")
    private Double totalSaleValue;

    @Column(name = "payment_status", length = 50)
    private String paymentStatus;  // e.g. Paid / Pending / Partially Paid

    @Column(name = "invoice_no", length = 100)
    private String invoiceNo;  // Linked to financial module

    @Column(name = "dispatch_method", length = 100)
    private String dispatchMethod;  // e.g. Truck, Container, Pickup

}
