package com.minh.shopee.config;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import com.minh.shopee.config.routes.CommonRoutes;
import com.minh.shopee.config.routes.ProductRoutes;
import com.minh.shopee.config.routes.UserRoutes;
import com.minh.shopee.domain.constant.ApiRoutes;

@Configuration
public class SecurityConfiguration {

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http,
                        CustomAuthenticationEntryPoint customAuthenticationEntryPoint)
                        throws Exception {

                // 1. Tạo danh sách public versioned routes theo từng API version
                List<String> versionedWhitelist = ApiRoutes.API_VERSIONS.stream()
                                .flatMap(version -> Arrays.stream(ApiRoutes.PUBLIC_VERSIONED_ENDPOINTS)
                                                .map(path -> ApiRoutes.API_BASE + "/" + version + path))
                                .toList();
                // 2. Gộp tất cả các route public từ các module
                String[] whitelist = Stream.of(
                                versionedWhitelist,
                                Arrays.asList(ApiRoutes.PUBLIC_COMMON_ENDPOINTS),
                                Arrays.asList(CommonRoutes.SWAGGER),
                                Arrays.asList(CommonRoutes.LOCATION_API),
                                Arrays.asList(UserRoutes.PUBLIC_ENDPOINTS),
                                Arrays.asList(ProductRoutes.PUBLIC_ENDPOINTS))
                                .flatMap(Collection::stream)
                                .toArray(String[]::new);

                http
                                // CSRF nên disable cho REST API
                                .csrf(csrf -> csrf.disable())

                                // CORS mặc định
                                .cors(Customizer.withDefaults())

                                // Phân quyền route
                                .authorizeHttpRequests(authz -> {
                                        // 3. Public routes
                                        authz.requestMatchers(whitelist).permitAll();
                                        authz.requestMatchers("/ws/**").permitAll();

                                        // 4. Các route chỉ cho phép method cụ thể (GET, POST, ...)
                                        ApiRoutes.METHOD_SPECIFIC_ENDPOINTS.forEach((method, paths) -> authz
                                                        .requestMatchers(method, paths).permitAll());

                                        // 5. Các route còn lại phải xác thực
                                        authz.anyRequest().authenticated();
                                })

                                // Sử dụng JWT
                                .oauth2ResourceServer(oauth2 -> oauth2
                                                .jwt(Customizer.withDefaults())
                                                .authenticationEntryPoint(customAuthenticationEntryPoint))

                                // Tắt form login truyền thống
                                .formLogin(form -> form.disable())

                                // Stateless cho RESTful API
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

                return http.build();
        }
}
