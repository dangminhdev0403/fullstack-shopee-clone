package com.minh.shopee.services.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.minh.shopee.repository.PermissionRepository;
import com.minh.shopee.services.PermissionService;
import com.minh.shopee.services.utils.error.AppException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    // Assuming you have a PermissionRepository injected here
    private final PermissionRepository permissionRepository;

    @Override
    public <T> Page<T> getAllPermissions(Class<T> type, Pageable pageable) {
        return permissionRepository.findAllBy(type, pageable);
    }

    @Override
    public <T> T getPermissionById(Long id, Class<T> type) {
        return permissionRepository.findById(id, type)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND.value(), "Permission not found",
                        "Permission with id " + id + " not found"));
    }
}
