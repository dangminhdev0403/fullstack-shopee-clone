package com.minh.shopee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.minh.shopee.domain.model.OrderDetail;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

}
