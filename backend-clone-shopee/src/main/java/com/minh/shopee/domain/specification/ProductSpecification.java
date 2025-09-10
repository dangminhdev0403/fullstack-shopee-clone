package com.minh.shopee.domain.specification;

import java.math.BigDecimal;

import org.springframework.data.jpa.domain.Specification;

import com.minh.shopee.domain.model.Product;

public class ProductSpecification {

    private ProductSpecification() {
        // private constructor to prevent instantiation
    }

    public static Specification<Product> hasName(String name) {
        return (root, query, cb) -> {
            if (name == null || name.trim().isEmpty() || name.trim().equals(",")) {
                return cb.conjunction(); // không áp điều kiện gì → trả về tất cả
            }
            return cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
        };
    }

    public static Specification<Product> hasCategoryId(String categoryId) {
        return (root, query, cb) -> {
            if (categoryId == null || categoryId.isBlank()) {
                return cb.conjunction();
            }
            return cb.equal(root.get("category").get("id"), Long.parseLong(categoryId));
        };
    }

    public static Specification<Product> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction(); // luôn true, không ảnh hưởng filter khác
            }
            return cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%");
        };
    }

    public static Specification<Product> hasPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> cb.between(root.get("price"), minPrice, maxPrice);
    }

    public static Specification<Product> hasStock(Integer stock) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("stock"), stock);
    }

    public static Specification<Product> hasShopId(Long shopId) {
        return (root, query, cb) -> cb.equal(root.get("shop").get("id"), shopId);
    }
}
