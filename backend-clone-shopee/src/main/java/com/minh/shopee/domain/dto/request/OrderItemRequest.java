package com.minh.shopee.domain.dto.request;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class OrderItemRequest {
    private long productId;
    private Long shopId;
    private BigDecimal price;
    private Integer quantity;
}