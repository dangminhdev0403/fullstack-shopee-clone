package com.minh.shopee.services.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.minh.shopee.domain.model.Role;
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

    @Override
    public Role createRole(Role role) {
        log.info("Creating role with name: {}", role.getName());
        boolean exists = this.roleRepository.existsByName(role.getName());
        if (exists) {
            log.warn("Role with name {} already exists", role.getName());
            throw new DuplicateException(role.getName(), "Role already exists");
        }
        return this.roleRepository.save(role); // Placeholder return
    }

    @Override
    public void deleteRole(Long id) {
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
    public void updateRole(Role role) {
        boolean exists = this.roleRepository.existsByName(role.getName());
        if (exists) {
            log.warn("Role with name {} already exists", role.getName());
            throw new DuplicateException(role.getName(), "Role already exists");
        }
        Role roleDB = this.roleRepository.findById(
                role.getId(), Role.class)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Role not found",
                        "Role with id " + role.getId() + " not found"));
        roleDB.setName(role.getName());
        this.roleRepository.save(roleDB);

    }

}
