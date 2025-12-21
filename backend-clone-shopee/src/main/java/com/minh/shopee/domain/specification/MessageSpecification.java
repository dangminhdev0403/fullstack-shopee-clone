package com.minh.shopee.domain.specification;

import org.springframework.data.jpa.domain.Specification;

import com.minh.shopee.domain.model.Message;

public class MessageSpecification {
    public static Specification<Message> betweenUsers(Long a, Long b) {
        return (root, query, cb) -> {

            var aToB = cb.and(
                    cb.equal(root.get("sender").get("id"), a),
                    cb.equal(root.get("receiver").get("id"), b));

            var bToA = cb.and(
                    cb.equal(root.get("sender").get("id"), b),
                    cb.equal(root.get("receiver").get("id"), a));

            query.orderBy(cb.desc(root.get("createdAt")));
            return cb.or(aToB, bToA);
        };
    }

}
