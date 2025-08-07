package com.minh.shopee.domain.specification;

import org.springframework.data.jpa.domain.Specification;

import com.minh.shopee.domain.model.User;

public class UserSpecification {

    public static Specification<User> hasName(String name) {
        return (root, query, cb) -> cb.like(root.get("name"), "%" + name + "%");
    }
}
