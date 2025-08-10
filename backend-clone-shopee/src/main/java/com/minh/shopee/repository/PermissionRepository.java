package com.minh.shopee.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.minh.shopee.domain.model.Permission;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Permission findByMethodAndPath(String method, String path);

    <T> Page<T> findAllBy(Class<T> type, Pageable pageable);

    <T> Optional<T> findById(Long id, Class<T> type);

}
