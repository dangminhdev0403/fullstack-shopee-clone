package com.minh.shopee.services.impl;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.minh.shopee.domain.dto.request.rbac.RoleRequest;
import com.minh.shopee.domain.dto.response.projection.RoleProjection;
import com.minh.shopee.domain.model.Permission;
import com.minh.shopee.domain.model.Role;
import com.minh.shopee.repository.PermissionRepository;
import com.minh.shopee.repository.RoleRepository;
import com.minh.shopee.services.RoleService;
import com.minh.shopee.services.utils.error.AppException;
import com.minh.shopee.services.utils.error.DuplicateException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "RoleServiceImp")
public class RoleServiceImp implements RoleService {

    private final RoleRepository roleRepository; // Assuming a RoleRepository exists for database operations
    private final PermissionRepository permissionRepository;

    @Override
    public Role createRole(RoleRequest roleReq) {
        if (roleReq.getId() == 1)
            throw new AppException(HttpStatus.BAD_REQUEST.value(), "Role not allowed", "Role not allowed");
        Set<Long> permissionIds = roleReq.getPermissionIds();

        log.info("Creating role with name: {}", roleReq.getName().trim());
        boolean exists = this.roleRepository.existsByName(roleReq.getName().trim());
        if (exists) {
            log.warn("Role with name {} already exists", roleReq.getName().trim());
            throw new DuplicateException(roleReq.getName().trim(), "Role already exists");
        }
        Role role = new Role();
        role.setName(roleReq.getName().trim());
        if (permissionIds != null && !permissionIds.isEmpty()) {

            Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(permissionIds));
            role.setPermissions(permissions);
        }

        return this.roleRepository.save(role); // Placeholder return
    }

    @Override
    public void deleteRole(Long id) {
        if (id == 1)
            throw new AppException(HttpStatus.BAD_REQUEST.value(), "Role not allowed", "Role not allowed");
        if (!this.roleRepository.existsById(id)) {
            log.error("Role with id {} not found", id);
            throw new AppException(HttpStatus.NOT_FOUND.value(), "Role not found",
                    "Role with id " + id + " not found");
        }
        log.info("Deleting role with id: {}", id);
        this.roleRepository.deleteById(id);
    }

    @Override
    public <T> Page<T> getAllRoles(Class<T> type, Pageable pageable) {
        log.info("Fetching list of categories with projection type ok: {}", type.getSimpleName());
        return this.roleRepository.findAllBy(type, pageable);
    }

    @Override
    public <T> T getRoleById(Long id, Class<T> type) {
        log.info("Fetching role by id: {} with projection type: {}", id, type.getSimpleName());
        return this.roleRepository.findById(id, type)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Role not found",
                        "Role with id " + id + " not found")); // Placeholder exception
    }

    @Override
    public void updateRole(RoleRequest role) {
        Role roleDB = this.roleRepository.findById(
                role.getId(), Role.class)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Role not found",
                        "Role with id " + role.getId() + " not found"));
        if (role.getName() != null && !role.getName().isEmpty()) {
            boolean exists = this.roleRepository.existsByName(role.getName().trim());
            if (exists) {
                log.warn("Role with name {} already exists", role.getName());
                throw new DuplicateException(role.getName(), "Role already exists");
            }

            roleDB.setName(role.getName().trim());
        }
        if (role.getPermissionIds() != null && !role.getPermissionIds().isEmpty()) {
            Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(role.getPermissionIds()));
            roleDB.setPermissions(permissions);
        }
        this.roleRepository.save(roleDB);

    }

    @Override
    public Role getRoleById(Long id) {
        log.info("Fetching role by id: {}", id);
        return this.roleRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Role not found",
                        "Role with id " + id + " not found")); // Placeholder exception
    }

    @Override
    public Page<RoleProjection> getAllRoles(Pageable pageable) {
        log.info("Fetching all roles with projection");
        return this.roleRepository.findAllProjectedBy(pageable);

    }

}
