package com.minh.shopee.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.minh.shopee.domain.model.Shop;

public interface ShopRepository extends JpaRepository<Shop, Long>, JpaSpecificationExecutor<Shop> {
    boolean existsByEmail(String email);

    Optional<Shop> findByOwnerId(Long ownerId);

    boolean existsByOwnerId(Long ownerId);

}
