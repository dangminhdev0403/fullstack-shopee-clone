package com.minh.shopee.domain.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private String receiverName;
    private String receiverAddress;
    private String receiverPhone;
    private String paymentMethod;
    private Double shippingFee;
    private Double discount;
    private List<OrderItemRequest> items;
}
