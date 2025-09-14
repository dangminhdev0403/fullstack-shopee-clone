package com.minh.shopee.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.minh.shopee.domain.dto.request.rbac.RoleRequest;
import com.minh.shopee.domain.dto.response.projection.RoleProjection;
import com.minh.shopee.domain.model.Role;

public interface RoleService {

    Role createRole(RoleRequest request);

    void updateRole(RoleRequest role);

    <T> T getRoleById(Long id, Class<T> type);

    Role getRoleById(Long id);
    Page<RoleProjection> getAllRoles(Pageable pageable);

    <T> Page<T> getAllRoles(Class<T> type, Pageable pageable);

    void deleteRole(Long id);

}
