package com.minh.shopee.controllers.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minh.shopee.domain.constant.ApiRoutes;
import com.minh.shopee.domain.dto.response.analytics.ProductOverviewDTO;
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

}
