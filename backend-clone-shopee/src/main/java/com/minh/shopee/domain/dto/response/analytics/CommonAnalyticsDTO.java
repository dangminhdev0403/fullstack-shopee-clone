package com.minh.shopee.domain.dto.response.analytics;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CommonAnalyticsDTO {

    private long totalProducts;
    private long toltalOrdersNow;
    private long totalCustomer;

}
