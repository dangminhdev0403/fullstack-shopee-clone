package com.minh.shopee.services;

import org.apache.poi.ss.formula.functions.T;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.minh.shopee.domain.dto.request.CreateOrderRequest;
import com.minh.shopee.domain.dto.request.UpdateOrderDTO;

public interface OrderService {
    void createOrder(CreateOrderRequest req, long userId);

    <T> Page<T> getOrdersListByUser(Pageable pageable, Class<T> projectionClass);;

    void cancelOrder(UpdateOrderDTO req);
}
