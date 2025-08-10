package com.minh.shopee.domain.constant;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpMethod;

public class ApiRoutes {
        private ApiRoutes() {
                // Prevent instantiation
        }

        public static final String ROLES = "/roles";
        public static final String USERS = "/users";
        public static final String ADMIN = "/admin";
        public static final String API_BASE = "/api";
        public static final String API_BASE_V1 = "/api/v1";
        public static final List<String> API_VERSIONS = List.of("v1", "v2", "v3");
        public static final String CATEGORIES = "/categories";
        public static final String PRODUCTS = "/products";

        public static final String[] PUBLIC_VERSIONED_ENDPOINTS = {
                        "/posts/**", "/auth/login", "/auth/refresh", "/auth/logout", "/auth/register",
                        "/provinces/**", "/districts/**", "/wards/**"
        };

        public static final String[] PUBLIC_COMMON_ENDPOINTS = {
                        "/swagger-ui/**", "/v3/api-docs/**"
        };

        public static final Map<HttpMethod, String[]> METHOD_SPECIFIC_ENDPOINTS = Map.of(
                        HttpMethod.GET, new String[] {
                                        API_BASE + "/v1" + CATEGORIES + "/**",
                                        API_BASE + "/v2" + CATEGORIES + "/**",
                                        API_BASE + "/v3" + CATEGORIES + "/**",
                                        API_BASE + "/v1" + PRODUCTS + "/**"
                        });

}
