package com.minh.shopee.domain.dto.request;

import com.minh.shopee.domain.constant.OrderStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderShopUpdateDTO {

    @NotNull(message = "Id is required")
    private Long id;
    private Long quantity;
    private OrderStatus status;
}
