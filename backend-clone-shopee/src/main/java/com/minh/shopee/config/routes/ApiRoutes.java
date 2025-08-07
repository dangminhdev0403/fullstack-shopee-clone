package com.minh.shopee.config.routes;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpMethod;

public class ApiRoutes {
        private ApiRoutes() {
                // Prevent instantiation
        }

        public static final String API_BASE = "/api";
        public static final List<String> API_VERSIONS = List.of("v1", "v2", "v3");

        public static final String[] PUBLIC_VERSIONED_ENDPOINTS = {
                        "/posts/**", "/auth/login", "/auth/refresh",
                        "/provinces/**", "/districts/**", "/wards/**"
        };

        public static final String[] PUBLIC_COMMON_ENDPOINTS = {
                        "/swagger-ui/**", "/v3/api-docs/**"
        };

        public static final Map<HttpMethod, String[]> METHOD_SPECIFIC_ENDPOINTS = Map.of(
                        HttpMethod.GET, new String[] {
                                        API_BASE + "/v1/categories/**",
                                        API_BASE + "/v2/categories/**",
                                        API_BASE + "/v3/categories/**",
                                        API_BASE + "/v1/products/**"
                        });

}
