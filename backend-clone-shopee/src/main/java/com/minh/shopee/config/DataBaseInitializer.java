package com.minh.shopee.config;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import com.minh.shopee.domain.anotation.ApiDescription;
import com.minh.shopee.domain.model.Permission;
import com.minh.shopee.domain.model.Role;
import com.minh.shopee.domain.model.User;
import com.minh.shopee.repository.PermissionRepository;
import com.minh.shopee.repository.RoleRepository;
import com.minh.shopee.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j(topic = "DataBaseInitializer")
public class DataBaseInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RequestMappingHandlerMapping handlerMapping;
    private final PermissionRepository permissionRepository;

    public DataBaseInitializer(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            PermissionRepository permissionRepository,
            @Qualifier("requestMappingHandlerMapping") RequestMappingHandlerMapping handlerMapping,
            RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.handlerMapping = handlerMapping;
        this.permissionRepository = permissionRepository;
    }

    @Override
    public void run(String... args) {
        log.info("🚀 Starting database initialization...");
        initializePermissions();

        initializeRoles();
        initializeUsers();
        log.info("✅ Database initialization completed.");
    }

    /**
     * Khởi tạo Role mặc định nếu DB chưa có
     */
    @Transactional
    public void initializeRoles() {
        if (roleRepository.count() == 0) {
            log.info("📌 No roles found, creating default roles...");
            String[] listRoleName = { "ROLE_ADMIN", "ROLE_SELLER", "ROLE_USER" };
            List<Role> listRole = Arrays.stream(listRoleName).map(roleName -> {
                Role role = new Role();
                role.setName(roleName);
                return role;
            }).toList();
            roleRepository.saveAll(listRole);
            log.info("SUCCESSFULLY CREATE LIST ROLE {}");
        }
    }

    /**
     * Khởi tạo User mặc định nếu DB chưa có
     */
    @Transactional
    public void initializeUsers() {
        if (userRepository.count() == 0) {
            log.info("📌 No users found, creating default admin user...");
            Role adminRole = roleRepository.findById(1L)
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN with ID=1 not found"));

            User adminUser = new User();
            adminUser.setEmail("admin@gmail.com");
            adminUser.setName("ADMIN");

            adminUser.setRoles(Set.of(adminRole));

            adminUser.setPassword(passwordEncoder.encode("123456"));

            userRepository.save(adminUser);
            log.info("✅ Default admin user created: admin@gmail.com / 123456");
        }
    }

    /**
     * Đồng bộ Permission với danh sách Endpoint thực tế
     * + Xóa Permission thừa
     * + Thêm Permission mới
     * + Gán Permission mới cho ROLE_ADMIN
     */
    @Transactional
    public void initializePermissions() {
        log.info("📌 Syncing permissions with existing API endpoints...");

        // 1. Lấy toàn bộ endpoint từ Spring
        Set<String> endpointsFromSpring = handlerMapping.getHandlerMethods().entrySet().stream()
                .flatMap(entry -> {
                    var requestMappingInfo = entry.getKey();
                    var methods = requestMappingInfo.getMethodsCondition().getMethods();
                    var patterns = Optional.ofNullable(requestMappingInfo.getPathPatternsCondition())
                            .map(p -> p.getPatterns())
                            .orElse(Set.of());

                    Method method = entry.getValue().getMethod();
                    ApiDescription apiDescription = method.getAnnotation(ApiDescription.class);
                    String description = (apiDescription != null) ? apiDescription.value() : method.getName();

                    return methods.stream()
                            .flatMap(m -> patterns.stream()
                                    .map(path -> m.name() + ":" + path + ":" + description));
                })
                .collect(Collectors.toSet());

        // 2. Lấy toàn bộ permission từ DB
        List<Permission> currentPermissions = permissionRepository.findAll();
        Set<String> endpointsFromDB = currentPermissions.stream()
                .map(p -> p.getMethod() + ":" + p.getPath() + ":" + p.getDescrition())
                .collect(Collectors.toSet());

        // 3. Xác định permission cần xóa
        List<Permission> toDelete = currentPermissions.stream()
                .filter(p -> !endpointsFromSpring.contains(
                        p.getMethod() + ":" + p.getPath() + ":" + p.getDescrition()))
                .toList();

        // 4. Xác định permission cần thêm
        List<Permission> toAdd = endpointsFromSpring.stream()
                .filter(e -> !endpointsFromDB.contains(e))
                .map(e -> {
                    String[] parts = e.split(":", 3);
                    return new Permission(parts[2], parts[0], parts[1]);
                })
                .toList();

        // 5. Xóa permission thừa
        if (!toDelete.isEmpty()) {
            permissionRepository.deleteAll(toDelete);
            log.info("🗑 Deleted {} obsolete permissions", toDelete.size());
        }

        // 6. Thêm permission mới và gán cho ROLE_ADMIN
        if (!toAdd.isEmpty()) {
            permissionRepository.saveAll(toAdd);
            log.info("➕ Added {} new permissions", toAdd.size());

            Role adminRole = roleRepository.findById(1L)
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));

            adminRole.getPermissions().addAll(toAdd);
            roleRepository.save(adminRole);
            log.info("🔑 Granted all new permissions to ROLE_ADMIN");
        }

        if (toAdd.isEmpty() && toDelete.isEmpty()) {
            log.info("✅ Permissions are already up to date.");
        }
    }
}
