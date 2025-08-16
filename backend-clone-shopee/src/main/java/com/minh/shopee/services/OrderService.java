package com.minh.shopee.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.minh.shopee.domain.dto.request.CreateOrderRequest;
import com.minh.shopee.domain.dto.request.UpdateOrderDTO;
import com.minh.shopee.domain.dto.response.projection.OrderProjection;

public interface OrderService {
    void createOrder(CreateOrderRequest req, long userId);

    Page<OrderProjection> getOrdersListByUser(Pageable pageable);

    void cancelOrder(UpdateOrderDTO req);
}
