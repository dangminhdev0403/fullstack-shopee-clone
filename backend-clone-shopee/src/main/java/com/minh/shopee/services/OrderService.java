package com.minh.shopee.services;

public interface OrderService {
    void createOrder(String userId, String productId, int quantity);
}
