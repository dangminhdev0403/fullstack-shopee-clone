package com.minh.shopee.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.minh.shopee.domain.constant.OrderStatus;
import com.minh.shopee.domain.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    <T> Page<T> findAllByUserId(Long userId, Class<T> type, Pageable pageable);

    <T> Page<T> findAllByUserIdAndStatus(Long userId, OrderStatus status, Class<T> type, Pageable pageable);

}
