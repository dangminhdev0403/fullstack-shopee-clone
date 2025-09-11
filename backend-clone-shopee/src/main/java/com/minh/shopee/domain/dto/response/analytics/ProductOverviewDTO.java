package com.minh.shopee.domain.dto.response.analytics;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class ProductOverviewDTO {
    private long sold;
    private long outOfStock;
}
