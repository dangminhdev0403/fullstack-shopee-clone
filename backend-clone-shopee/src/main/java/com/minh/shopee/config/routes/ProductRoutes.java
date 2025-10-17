package com.minh.shopee.config.routes;

import com.minh.shopee.domain.constant.ApiRoutes;

public class ProductRoutes {
    public static final String BASE = ApiRoutes.API_BASE;

    private ProductRoutes() {
        // Prevent instantiation
    }

    public static final String[] PUBLIC_ENDPOINTS = {
            BASE + "/v1/products/search_hints/**",
            // BASE + "/v2/products/**"
    };

    public static final String[] ADMIN_ONLY_ENDPOINTS = {
            BASE + "/v1/products/admin/**"
    };
}
