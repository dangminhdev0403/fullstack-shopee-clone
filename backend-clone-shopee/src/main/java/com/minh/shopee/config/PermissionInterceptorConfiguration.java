package com.minh.shopee.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.minh.shopee.config.interceptor.PermissionInterceptor;

@Configuration
public class PermissionInterceptorConfiguration implements WebMvcConfigurer {

    private final PermissionInterceptor permissionInterceptor;

    public PermissionInterceptorConfiguration(PermissionInterceptor permissionInterceptor) {
        this.permissionInterceptor = permissionInterceptor;
    }

    @Override

    public void addInterceptors(InterceptorRegistry  registry) {
        String[] whiteList = { "/admin/**" };
        registry.addInterceptor(permissionInterceptor).addPathPatterns(whiteList);
    }
}
