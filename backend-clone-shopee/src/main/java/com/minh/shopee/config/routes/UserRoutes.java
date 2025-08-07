package com.minh.shopee.config.routes;

public class UserRoutes {

    private UserRoutes() {
        // Prevent instantiation
    }

    public static final String BASE = "/users";

    public static final String[] PUBLIC_ENDPOINTS = {
            BASE + "/register",
            BASE + "/login"
    };

    public static final String[] PROTECTED_ENDPOINTS = {
            BASE + "/me",
            BASE + "/orders/**",
            BASE + "/cart/**"
    };
}
