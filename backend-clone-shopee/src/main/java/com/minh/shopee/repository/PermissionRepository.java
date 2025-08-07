package com.minh.shopee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.minh.shopee.domain.model.Permission;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Permission findByMethodAndPath(String method, String path);

}
