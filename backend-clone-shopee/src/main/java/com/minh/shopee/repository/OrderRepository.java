package com.minh.shopee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.minh.shopee.domain.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

}
