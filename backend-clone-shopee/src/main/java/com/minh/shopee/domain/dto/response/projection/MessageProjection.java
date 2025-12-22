package com.minh.shopee.domain.dto.response.projection;

import java.time.LocalDateTime;

public interface MessageProjection {
    Long getId();

    String getContent();

    LocalDateTime getCreatedAt();

    ReceiverProjection getReceiver();

    SenderProjection getSender();

    interface SenderProjection {
        Long getId();

        String getAvatarUrl();

        String getName();
    }

    interface ReceiverProjection {
        Long getId();

        String getAvatarUrl();

        String getName();
    }
}
