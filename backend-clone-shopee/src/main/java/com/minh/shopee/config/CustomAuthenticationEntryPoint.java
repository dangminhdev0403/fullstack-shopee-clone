package com.minh.shopee.config;

import java.io.IOException;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minh.shopee.domain.dto.response.ResponseData;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component("authenticationEntryPoint")
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final AuthenticationEntryPoint delegate = new BearerTokenAuthenticationEntryPoint();
    private final ObjectMapper objectMapper;
    private final PathMatcher pathMatcher = new AntPathMatcher(); // Thêm PathMatcher để khớp route
    private final RequestMappingHandlerMapping handlerMapping; // Inject từ ApplicationContext

    public CustomAuthenticationEntryPoint(
            ObjectMapper objectMapper,
            @Qualifier("requestMappingHandlerMapping") RequestMappingHandlerMapping handlerMapping) {
        this.objectMapper = objectMapper;
        this.handlerMapping = handlerMapping;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        response.setContentType("application/json;charset=UTF-8");
        String path = request.getRequestURI();

        // Kiểm tra xem route có hợp lệ không
        if (!isValidRoute(path)) {
            // Route không hợp lệ -> trả về 404
            int statusCode = HttpStatus.NOT_FOUND.value();
            response.setStatus(statusCode);
            ResponseData<Object> data = ResponseData.<Object>builder()
                    .status(statusCode)
                    .data(null)
                    .error("Endpoint không tồn tại")
                    .message("Không tìm thấy này " + path)
                    .build();
            response.getWriter().write(objectMapper.writeValueAsString(data));
            return;
        }

        // Route hợp lệ nhưng token không hợp lệ -> trả về 401

        int statusCode = HttpStatus.UNAUTHORIZED.value();
        response.setStatus(statusCode);
        ResponseData<Object> data = ResponseData.<Object>builder()
                .status(statusCode)
                .data(null)
                .error("401")
                .message("Token không hợp lệ")
                .build();

        response.getWriter().write(objectMapper.writeValueAsString(data));
    }

    @SuppressWarnings("null")
    private boolean isValidRoute(String uri) {

        Set<String> allRoutes = handlerMapping.getHandlerMethods()
                .keySet()
                .stream()
                .flatMap(info -> {
                    if (info.getPathPatternsCondition() != null) {
                        return info.getPathPatternsCondition().getPatterns().stream()
                                .map(pattern -> pattern.getPatternString()); // Lấy đường dẫn thực tế
                    }
                    return Stream.empty();
                })
                .collect(Collectors.toSet());

        return allRoutes.stream().anyMatch(route -> pathMatcher.match(route, uri));
    }

}
