package com.minh.shopee.domain.dto.request;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long productId;
    private Long shopId;
    private Double price;
    private Integer quantity;
}