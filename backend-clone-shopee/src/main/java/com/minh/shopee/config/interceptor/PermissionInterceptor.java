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

    private final ObjectMapper objectMapper; // Dùng để trả JSON response
    private final UserService userService; // Lấy thông tin User từ DB
    private final PermissionRepository permissionRepository; // Lấy thông tin Permission từ DB

    /**
     * Interceptor này sẽ chạy trước khi request vào Controller (preHandle)
     * 
     * Mục tiêu:
     * - Kiểm tra user hiện tại có quyền truy cập endpoint đang gọi hay không
     * - Dựa trên cơ chế RBAC (Role-Based Access Control)
     */
    @Override
    @Transactional
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws IOException {

        // Lấy ra pattern khớp nhất với request, ví dụ: "/admin/api/v1/users"
        String path = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);

        // Lấy method HTTP (GET, POST, PUT, DELETE)
        String httpMethod = request.getMethod();

        // Lấy username từ Security Context (Spring Security)
        Optional<String> usernameOptional = SecurityUtils.getCurrentUserLogin();
        String username = usernameOptional.orElse(null);

        // Nếu có đăng nhập
        if (username != null && !username.isEmpty()) {
            User user = this.userService.findByUsername(username); // Lấy thông tin user từ DB

            // Lấy danh sách role của user
            Set<Role> roles = user.getRoles();

            if (!roles.isEmpty()) {
                // Tìm permission tương ứng với method + path trong DB
                Permission currentPermission = permissionRepository.findByMethodAndPath(httpMethod, path);

                // Kiểm tra user có phải ROLE_ADMIN hoặc có permission tương ứng hay không
                boolean isRole = roles.stream().anyMatch(role -> role.getName().equals("ROLE_ADMIN") ||
                        role.getPermissions().contains(currentPermission));

                // Nếu có quyền thì cho phép đi tiếp
                if (isRole) {
                    return true;
                } else {
                    // Nếu không có quyền -> trả về 403
                    writeErrorResponse(response, HttpStatus.FORBIDDEN, "Không có quyền hạn");
                    return false;
                }
            } else {
                // User không có role nào -> 403
                writeErrorResponse(response, HttpStatus.FORBIDDEN, "Không có quyền hạn");
                return false;
            }
        }

        // Nếu user chưa đăng nhập → vẫn cho qua, để AuthenticationEntryPoint xử lý 401

        return true;
    }

    /**
     * Helper method để viết JSON trả về khi bị từ chối
     */
    private void writeErrorResponse(HttpServletResponse response, HttpStatus status, String message)
            throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(status.value());
        ResponseData<Object> data = ResponseData.<Object>builder()
                .status(status.value())
                .data(null)
                .error(String.valueOf(status.value()))
                .message(message)
                .build();
        response.getWriter().write(objectMapper.writeValueAsString(data));
    }
}
