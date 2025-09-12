package com.minh.shopee.services;

import com.minh.shopee.domain.dto.response.projection.admin.analytics.ProductOverviewDTO;

public interface AnalyticsService {

    ProductOverviewDTO getProductOverview();
}