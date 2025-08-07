package com.minh.shopee.config;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final RequestMappingHandlerMapping handlerMapping;
    private final PermissionRepository permissionRepository;

    public DataBaseInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder,
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
    public void run(String... args) throws Exception {
        log.info("Starting database initialization...");
        initializeUsers();
        initializePermissions();
        log.info("Database initialization completed.");
    }

    @Transactional
    private void initializeUsers() {
        long count = userRepository.count();

        if (count == 0) {
            log.info("No users found, creating default user...");
            User defaultUser = new User();
            defaultUser.setEmail("admin@gmail.com");
            defaultUser.setName("ADMIN");
            defaultUser.setPassword(passwordEncoder.encode("123456"));
            userRepository.save(defaultUser);
            log.info("Default user created successfully.");
        }

    }

    @Transactional
    public void initializeRoles() {
        long countRole = this.roleRepository.count();
        if (countRole == 0) {
            log.info("COUNT ROLE = 0 CREATE ROLE {}");
            String[] listRoleName = { "ROLE_ADMIN", "ROLE_USER", "ROLE_SELLER" };
            List<Role> listRole = Arrays.stream(listRoleName).map(roleName -> {
                Role role = new Role();
                role.setName(roleName);
                return role;
            }).toList();
            this.roleRepository.saveAll(listRole);
            log.info("SUCCESSFULLY CREATE LIST ROLE {}");

        }
    }

    @Transactional
    private void initializePermissions() {
        long countPermission = permissionRepository.count();
        long countEndpoints = handlerMapping.getHandlerMethods().size();

        // Tập hợp tất cả các endpoint hiện có trong hệ thống Spring
        Set<String> existingEndpoints = handlerMapping.getHandlerMethods().entrySet().stream()
                .flatMap(entry -> {
                    var requestMappingInfo = entry.getKey();
                    var methods = requestMappingInfo.getMethodsCondition().getMethods();
                    var patternsCondition = requestMappingInfo.getPathPatternsCondition();

                    var patterns = (patternsCondition != null)
                            ? patternsCondition.getPatterns()
                            : Set.of(); // Tránh NullPointerException

                    return methods.stream()
                            .flatMap(m -> patterns.stream()
                                    .map(pattern -> m.name() + ":" + pattern.toString()));
                })
                .collect(Collectors.toSet());

        // Xóa các permissions không còn tồn tại trong Spring
        List<Permission> permissionsToDelete = permissionRepository.findAll().stream()
                .filter(permission -> !existingEndpoints.contains(permission.getMethod() + ":" + permission.getPath()))
                .toList();

        if (!permissionsToDelete.isEmpty()) {
            permissionRepository.deleteAll(permissionsToDelete);
            log.info("Deleted {} obsolete permissions.", permissionsToDelete.size());
        }

        // Thêm mới các permissions nếu thiếu
        if (countPermission != countEndpoints) {
            handlerMapping.getHandlerMethods().entrySet().stream()
                    .flatMap(entry -> {
                        var requestMappingInfo = entry.getKey();
                        var methods = requestMappingInfo.getMethodsCondition().getMethods();
                        var patternsCondition = requestMappingInfo.getPathPatternsCondition();

                        Method method = entry.getValue().getMethod();
                        ApiDescription apiDescription = method.getAnnotation(ApiDescription.class);

                        String description = apiDescription == null ? method.getName() : apiDescription.value();

                        var patterns = (patternsCondition != null)
                                ? patternsCondition.getPatterns()
                                : Set.of(); // Tránh NullPointerException

                        return methods.stream()
                                .flatMap(m -> patterns.stream()
                                        .map(pattern -> new Permission(description, m.name(), pattern.toString())));
                    })
                    .distinct()
                    .filter(permission -> permissionRepository.findByMethodAndPath(permission.getMethod(),
                            permission.getPath()) == null)
                    .forEach(permissionRepository::save);

            log.info("Permissions initialized from endpoints!");
        } else {
            log.info("Data is up to date, skipping initialization.");
        }
    }

}
