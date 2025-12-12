package com.minh.shopee.config;

import java.io.IOException;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.util.pattern.PathPattern;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minh.shopee.domain.dto.response.ResponseData;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component("authenticationEntryPoint")
@Slf4j
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;
    private final PathMatcher pathMatcher = new AntPathMatcher();
    private final Set<String> cachedRoutes; // <== Cache lại để không build mỗi request

    public CustomAuthenticationEntryPoint(
            ObjectMapper objectMapper,
            @Qualifier("requestMappingHandlerMapping") RequestMappingHandlerMapping handlerMapping) {
        this.objectMapper = objectMapper;

        // Build routes duy nhất 1 lần khi Spring khởi động
        this.cachedRoutes = handlerMapping.getHandlerMethods()
                .keySet()
                .stream()
                .flatMap(info -> {
                    if (info.getPathPatternsCondition() != null) {
                        return info.getPathPatternsCondition().getPatterns().stream()
                                .map(PathPattern::getPatternString);
                    }
                    return Stream.empty();
                })
                .collect(Collectors.toSet());

        log.info("📌 Cached API routes: {}", cachedRoutes);
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException ex) throws IOException, ServletException {

        String path = request.getRequestURI();
        response.setContentType("application/json;charset=UTF-8");

        // 1) Skip tất cả WebSocket/SockJS
        if (path.startsWith("/ws")) {

            return;
        }

        // 2) Check API route
        if (!isValidRoute(path)) {
            log.warn("⚠️ [404 NOT FOUND] URL: {}", request.getRequestURL());

            int statusCode = HttpStatus.NOT_FOUND.value();
            response.setStatus(statusCode);

            ResponseData<Object> data = ResponseData.<Object>builder()
                    .status(statusCode)
                    .data(null)
                    .error("Endpoint không tồn tại")
                    .message("Không tìm thấy url: " + path)
                    .build();

            response.getWriter().write(objectMapper.writeValueAsString(data));
            return;
        }

        // 3) Token invalid -> 401
        int statusCode = HttpStatus.UNAUTHORIZED.value();
        response.setStatus(statusCode);

        ResponseData<Object> data = ResponseData.<Object>builder()
                .status(statusCode)
                .data(null)
                .error("401 Unauthorized")
                .message("Token không hợp lệ")
                .build();

        response.getWriter().write(objectMapper.writeValueAsString(data));
    }

    private boolean isValidRoute(String uri) {
        // WebSocket đã xử lý phía trên
        return cachedRoutes.stream().anyMatch(route -> pathMatcher.match(route, uri));
    }
}
