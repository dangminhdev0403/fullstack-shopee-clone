package com.minh.shopee.config.interceptor;

import java.io.IOException;
import java.util.Optional;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minh.shopee.domain.dto.response.ResponseData;
import com.minh.shopee.domain.model.Permission;
import com.minh.shopee.domain.model.Role;
import com.minh.shopee.domain.model.User;
import com.minh.shopee.repository.PermissionRepository;
import com.minh.shopee.services.UserService;
import com.minh.shopee.services.utils.SecurityUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@SuppressWarnings("null")
@RequiredArgsConstructor
@Slf4j
@Component
public class PermissionInterceptor implements HandlerInterceptor {

    private final ObjectMapper objectMapper;

    private final UserService userService;

    private final PermissionRepository permissionRepository;

    @Override
    @Transactional
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws IOException {
        String path = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String httpMethod = request.getMethod();

        Optional<String> usernameOptional = SecurityUtils.getCurrentUserLogin();
        String username = usernameOptional.orElse(null);
        if (username != null && !username.isEmpty()) {
            User user = this.userService.findByUsername(username);

            // ! RBAC

            Set<Role> roles = user.getRoles();
            if (!roles.isEmpty()) {
                Permission currentPermission = permissionRepository.findByMethodAndPath(httpMethod, path);

                boolean isRole = roles.stream().anyMatch(role -> role.getName().equals("ROLE_ADMIN")
                        || role.getPermissions().contains(currentPermission));

                if (isRole) {
                    return true;
                } else {
                    response.setContentType("application/json;charset=UTF-8");

                    int statusCode = HttpStatus.FORBIDDEN.value();
                    response.setStatus(statusCode);
                    ResponseData<Object> data = ResponseData.<Object>builder()
                            .status(statusCode)
                            .data(null)
                            .error("403")
                            .message("Không có quyền hạn")
                            .build();

                    response.getWriter().write(objectMapper.writeValueAsString(data));
                    return false;
                }
            } else {
                response.setContentType("application/json;charset=UTF-8");

                int statusCode = HttpStatus.FORBIDDEN.value();
                response.setStatus(statusCode);
                ResponseData<Object> data = ResponseData.<Object>builder()
                        .status(statusCode)
                        .data(null)
                        .error("403")
                        .message("Không có quyền hạn")
                        .build();

                response.getWriter().write(objectMapper.writeValueAsString(data));
                return false;
            }

        }
        return true;

    }
}
