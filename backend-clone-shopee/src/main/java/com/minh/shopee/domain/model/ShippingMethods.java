package com.minh.shopee.domain.model;

import java.math.BigDecimal;

import com.minh.shopee.domain.base.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@Table(name = "shipping_methods")
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class ShippingMethods extends BaseEntity {

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private long maxSpeedKmh;
    private long minDayLimit;
    private long maxDayLimit;
    private BigDecimal basePrice;
    private BigDecimal pricePerKm;
    private boolean isActive;
}