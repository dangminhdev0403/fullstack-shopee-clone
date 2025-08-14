package com.minh.shopee.services;

import com.minh.shopee.domain.dto.request.CreateOrderRequest;

public interface OrderService {
    void createOrder(CreateOrderRequest req, long userId);
}
