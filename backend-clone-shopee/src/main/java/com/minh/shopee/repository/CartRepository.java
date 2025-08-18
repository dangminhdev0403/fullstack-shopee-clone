package com.minh.shopee.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.minh.shopee.domain.dto.response.projection.CartProjection;
import com.minh.shopee.domain.model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long>, JpaSpecificationExecutor<Cart> {
    Optional<Cart> findByUserId(Long userId);

    Optional<CartProjection> findProjectedByUserId(Long userId);

}
