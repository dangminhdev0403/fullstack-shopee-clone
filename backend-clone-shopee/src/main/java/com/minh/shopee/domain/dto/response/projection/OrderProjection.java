package com.minh.shopee.domain.dto.response.projection;

import java.time.Instant;
import java.util.List;

import com.minh.shopee.domain.model.OrderDetail;

public interface OrderProjection {
    Long getId();

    String getReceiverName();

    String getReceiverAddress();

    String getReceiverPhone();

    String getStatus();

    Instant getCreatedAt();

    List<OrderDetail> getOrderDetail();

    // nested projection (User)
    UserInfo getUser();

    interface UserInfo {
        Long getId();

    }
}
