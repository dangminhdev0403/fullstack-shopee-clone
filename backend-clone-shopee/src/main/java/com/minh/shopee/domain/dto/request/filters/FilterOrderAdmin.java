package com.minh.shopee.domain.dto.request.filters;

import com.minh.shopee.domain.constant.OrderStatus;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FilterOrderAdmin {
    private String keyword;
    private OrderStatus status;
}
