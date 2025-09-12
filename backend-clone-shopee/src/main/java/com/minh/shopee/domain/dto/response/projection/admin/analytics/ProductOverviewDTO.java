package com.minh.shopee.domain.dto.response.projection.admin.analytics;

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
