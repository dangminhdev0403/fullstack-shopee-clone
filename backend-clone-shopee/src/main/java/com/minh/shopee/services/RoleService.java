package com.minh.shopee.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.minh.shopee.domain.model.Role;

public interface RoleService {

    Role createRole(Role role);

    void updateRole(Role role);

    <T> T getRoleById(Long id, Class<T> type);

    <T> Page<T> getAllRoles(Class<T> type, Pageable pageable);

    void deleteRole(Long id);

}
