package com.minh.shopee.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateOrderDTO {
    private String userId;
    private String productId;
    private int quantity;
    private String shippingAddress;
}
