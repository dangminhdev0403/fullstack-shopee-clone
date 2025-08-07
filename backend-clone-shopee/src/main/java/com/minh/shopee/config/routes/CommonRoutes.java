package com.minh.shopee.config.routes;

public class CommonRoutes {

    private CommonRoutes() {
        // Prevent instantiation
    }

    public static final String[] SWAGGER = {
            "/swagger-ui/**", "/v3/api-docs/**"
    };

    public static final String[] LOCATION_API = {
            "/provinces/**", "/districts/**", "/wards/**"
    };
}
