package com.minh.shopee.domain.dto.response.projection;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;

public interface OrderHistoryProjection {
    Long getId();

    String getCode();

    String getReceiverName();

    String getReceiverAddress();

    String getReceiverPhone();

    String getStatus();

    BigDecimal getTotalPrice();

    Instant getCreatedAt();

    List<OrderDetailProjection> getOrderDetail();

    interface OrderDetailProjection {
        Long getId();

        Long getQuantity();

        BigDecimal getPrice();

        ProductProjection getProduct();
    }

    interface ProductProjection {

        String getName();

        // Projection SpEL để lấy phần tử đầu tiên trong list
        @Value("#{target.images != null && !target.images.isEmpty() ? target.images[0].imageUrl : null}")
        String getImage();

        ShopProjection getShop();
    }

    interface ShopProjection {
        long getId();

        OwnerInfo getOwner();

        interface OwnerInfo {
            Long getId();
        }

        String getShopName();
    }
}
