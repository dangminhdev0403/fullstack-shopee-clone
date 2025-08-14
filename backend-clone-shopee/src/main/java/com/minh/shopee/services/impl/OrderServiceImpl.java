package com.minh.shopee.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.minh.shopee.domain.dto.request.CreateOrderRequest;
import com.minh.shopee.domain.dto.request.OrderItemRequest;
import com.minh.shopee.domain.model.Order;
import com.minh.shopee.domain.model.User;
import com.minh.shopee.services.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j(topic = "orderService")
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    @Override
    public void createOrder(CreateOrderRequest req, long userId) {
        User currentUser = User.builder().id(userId).build();
        // Nhóm sản phẩm theo shopId
        Map<Long, List<OrderItemRequest>> groupedByShop = req.getItems()
                .stream()
                .collect(Collectors.groupingBy(OrderItemRequest::getShopId));

        List<Order> createdOrders = new ArrayList<>();
        

        throw new UnsupportedOperationException("Unimplemented method 'createOrder'");
    }

}
