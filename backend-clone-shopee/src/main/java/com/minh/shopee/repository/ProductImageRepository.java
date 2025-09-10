package com.minh.shopee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.minh.shopee.domain.model.ProductImage;

@Repository
public interface ProductImageRepository
                extends JpaRepository<ProductImage, Long>, JpaSpecificationExecutor<ProductImage> {

                void deleteAllByProductId(Long productId);
}
