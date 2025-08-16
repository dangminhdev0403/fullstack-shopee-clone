package com.minh.shopee.domain.dto.request;

import lombok.Data;

@Data
public class OrderItemRequest {
    private long productId;
    private Long shopId;
    private Integer quantity;
}