package com.minh.shopee.domain.specification;

import org.springframework.data.jpa.domain.Specification;

import com.minh.shopee.domain.constant.OrderStatus;
import com.minh.shopee.domain.model.Order;
import com.minh.shopee.domain.model.OrderDetail;
import com.minh.shopee.domain.model.Product;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

public class OrderDetailSpecification {

    public static Specification<OrderDetail> hasShopId(Long shopId) {
        return (root, query, cb) -> cb.equal(root.get("product").get("shop").get("id"), shopId);
    }

    public static Specification<OrderDetail> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank())
                return cb.conjunction();
            Join<OrderDetail, Order> orderJoin = root.join("order", JoinType.INNER);
            String pattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(orderJoin.get("code")), pattern),
                    cb.like(cb.lower(orderJoin.get("receiverName")), pattern),
                    cb.like(cb.lower(orderJoin.get("receiverPhone")), pattern));
        };
    }

    public static Specification<OrderDetail> hasStatus(OrderStatus status) {
        return (root, query, cb) -> {
            if (status == null)
                return cb.conjunction();
            Join<OrderDetail, Order> orderJoin = root.join("order", JoinType.INNER);
            return cb.equal(orderJoin.get("status"), status);
        };
    }

    public static Specification<OrderDetail> filterByShopStatusKeyword(
            Long shopId, OrderStatus status, String keyword) {
        return (root, query, cb) -> {
            // Join duy nhất
            Join<OrderDetail, Product> productJoin = root.join("product", JoinType.INNER);
            Join<OrderDetail, Order> orderJoin = root.join("order", JoinType.INNER);

            // Shop filter (bắt buộc)
            Predicate pShop = cb.equal(productJoin.get("shop").get("id"), shopId);

            // Status filter (optional) ✅ fix enum
            Predicate pStatus = (status != null)
                    ? cb.equal(orderJoin.get("status"), status)
                    : cb.conjunction();

            // Keyword filter (optional)
            Predicate pKeyword = cb.conjunction();
            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.toLowerCase() + "%";
                pKeyword = cb.or(
                        cb.like(cb.lower(orderJoin.get("code")), pattern),
                        cb.like(cb.lower(orderJoin.get("receiverPhone")), pattern));
            }

            // Kết hợp tất cả
            return cb.and(pShop, pStatus, pKeyword);
        };
    }

}
