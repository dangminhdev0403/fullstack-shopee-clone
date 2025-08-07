package com.minh.shopee.domain.specification;

import org.springframework.data.jpa.domain.Specification;

import com.minh.shopee.domain.model.ProductImage;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

public class ProductImageSpecs {

    private ProductImageSpecs() {
        // private constructor to prevent instantiation
    }

    public static Specification<ProductImage> findFirstImageByProductId(Long productId) {
        return (Root<ProductImage> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            // Tìm ảnh theo productId
            query.where(cb.equal(root.get("product").get("id"), productId));
            // Sắp xếp theo id để lấy ảnh đầu tiên
            query.orderBy(cb.asc(root.get("id")));
            return query.getRestriction();
        };
    }


    
}
