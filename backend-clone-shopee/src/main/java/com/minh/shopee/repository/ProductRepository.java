package com.minh.shopee.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.minh.shopee.domain.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    <T> Set<T> findAllBy(Class<T> type);

    <T> Page<T> findAllBy(Pageable pageable, Class<T> type);

    @SuppressWarnings("null")
    Page<Product> findAll(Pageable pageable);

    <T> Optional<T> findById(Long id, Class<T> type);

    Optional<Product> findByIdAndShopId(Long productId, Long shopId);
    
    <T> Page<T> findAllByStatus(com.minh.shopee.domain.constant.ProductStatus status, Pageable pageable, Class<T> type);

}
