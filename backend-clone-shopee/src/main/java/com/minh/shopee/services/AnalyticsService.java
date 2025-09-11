package com.minh.shopee.services;

import com.minh.shopee.domain.dto.response.analytics.ProductOverviewDTO;

public interface AnalyticsService {

    ProductOverviewDTO getProductOverview();
}