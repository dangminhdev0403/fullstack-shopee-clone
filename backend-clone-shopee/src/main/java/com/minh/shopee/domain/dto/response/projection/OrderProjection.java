package com.minh.shopee.domain.dto.response.projection;

import java.time.Instant;

public interface OrderProjection {
    Long getId();

    String getReceiverName();

    String getReceiverAddress();

    String getReceiverPhone();

    String getStatus();

    Instant getCreatedAt();

    // nested projection (User)
    UserInfo getUser();

    interface UserInfo {
        Long getId();

    }
}
