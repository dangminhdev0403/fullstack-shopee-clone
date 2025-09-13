package com.minh.shopee.services;

import java.time.Instant;
import java.util.List;

import com.minh.shopee.domain.dto.response.analytics.CommonAnalyticsDTO;
import com.minh.shopee.domain.dto.response.projection.admin.analytics.ProductOverviewDTO;
import com.minh.shopee.domain.model.ChartData;

public interface AnalyticsService {

    ProductOverviewDTO getProductOverview();

    CommonAnalyticsDTO getCommonAnalytics();

    List<ChartData> getWeeklyData(Instant start, Instant end);
}