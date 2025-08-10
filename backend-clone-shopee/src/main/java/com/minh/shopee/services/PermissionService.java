package com.minh.shopee.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PermissionService {
    <T> Page<T> getAllPermissions(Class<T> type, Pageable pageable);

    <T> T getPermissionById(Long id, Class<T> type);
}
