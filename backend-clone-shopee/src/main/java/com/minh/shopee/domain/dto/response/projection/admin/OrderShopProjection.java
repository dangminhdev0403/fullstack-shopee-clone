package com.minh.shopee.domain.dto.response.projection.admin;

import java.math.BigDecimal;
import java.time.Instant;

public interface OrderShopProjection {
    long getId();

    long getQuantity();

    BigDecimal getPrice();

    OrderProjection getOrder();

    ProductProjection getProduct();
    String getShopStatus();

    interface OrderProjection {
        String getCode();

        String getReceiverName();

        String getReceiverAddress();

        String getReceiverPhone();

        String getStatus();

        Instant getCreatedAt();

    }

    public interface ProductProjection {
        String getName();

    }
}
