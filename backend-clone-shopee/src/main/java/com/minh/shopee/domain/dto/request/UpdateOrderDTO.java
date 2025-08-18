package com.minh.shopee.domain.dto.request;

import com.minh.shopee.domain.constant.OrderStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateOrderDTO {
    @NotNull(message = "OrderId is required")
    private Long orderId;

    private OrderStatus status;
}
