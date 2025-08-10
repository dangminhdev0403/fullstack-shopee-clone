package com.minh.shopee.config.prefix;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Cấu hình tự động thêm tiền tố "/admin" cho tất cả Controller
 * nằm trong package "com.minh.shopee.controllers.admin" và các package con.
 * 
 * Điều này giúp tránh việc phải viết lại "/admin" trong từng @RequestMapping
 * của Controller.
 * 
 * Ví dụ:
 * - @RequestMapping("/api/v1/users") trong Admin UserController
 * => Khi chạy thực tế sẽ thành: "/admin/api/v1/users"
 * 
 * Lưu ý:
 * - Không ảnh hưởng đến các Controller ngoài package admin
 * - Áp dụng cả cho các package con, ví dụ:
 * com.minh.shopee.controllers.admin.users
 * com.minh.shopee.controllers.admin.orders
 */
@Configuration
public class AdminPathPrefixConfig implements WebMvcConfigurer {

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        // addPathPrefix(prefix, predicate)
        // prefix: "/admin" => thêm vào trước tất cả endpoint của Controller được chọn
        // predicate: điều kiện để xác định Controller nào được áp dụng prefix
        configurer.addPathPrefix("/api/v1/admin", controllerClass ->
        // Kiểm tra tên package của Controller có bắt đầu bằng
        // "com.minh.shopee.controllers.admin"
        controllerClass.getPackageName()
                .startsWith("com.minh.shopee.controllers.admin"));
    }
}
