package com.minh.shopee.controllers.admin;

import java.time.Instant;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.minh.shopee.domain.constant.ApiRoutes;
import com.minh.shopee.domain.dto.response.analytics.CommonAnalyticsDTO;
import com.minh.shopee.domain.dto.response.projection.admin.analytics.ProductOverviewDTO;
import com.minh.shopee.domain.model.ChartData;
import com.minh.shopee.services.AnalyticsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiRoutes.ANALYTICS)
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("product-overview")

    public ResponseEntity<ProductOverviewDTO> getAnalytics() {

        return ResponseEntity.ok(this.analyticsService.getProductOverview());
    }

    @GetMapping("common-analytics")
    public ResponseEntity<CommonAnalyticsDTO> getMethodName() {

        return ResponseEntity.ok(this.analyticsService.getCommonAnalytics());
    }

    @GetMapping("/weekly-data")
    public ResponseEntity<List<ChartData>> getWeeklyData(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant end) {

        return ResponseEntity.ok(this.analyticsService.getWeeklyData(start, end));

    }

}
