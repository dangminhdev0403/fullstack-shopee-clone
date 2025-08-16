package com.minh.shopee.domain.specification;

import org.springframework.data.jpa.domain.Specification;

import com.minh.shopee.domain.model.Order;

public class OrderSpecification {
    public static Specification<Order> hasShopId(Long shopId) {
        return (root, query, cb) -> {
            // Join Order → OrderDetail
            var orderDetails = root.join("orderDetail");
            // Join OrderDetail → Product
            var product = orderDetails.join("product");
            // Join Product → Shop
            var shop = product.join("shop");
            return cb.equal(shop.get("id"), shopId);
        };
    }

    public static Specification<Order> hasUserId(Long userId) {
        return (root, query, cb) -> {
            // Join Order → OrderDetail
            var orderDetails = root.join("orderDetail");
            // Join OrderDetail → Product
            var product = orderDetails.join("product");
            // Join Product → Shop
            var user = product.join("user");
            return cb.equal(user.get("id"), userId);
        };
    }

}
