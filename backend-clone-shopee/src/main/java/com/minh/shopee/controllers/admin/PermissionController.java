package com.minh.shopee.controllers.admin;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minh.shopee.domain.anotation.ApiDescription;
import com.minh.shopee.domain.constant.ApiRoutes;
import com.minh.shopee.domain.dto.response.rbac.PermissionDTO;
import com.minh.shopee.services.PermissionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiRoutes.PERMISSIONS)
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping("")
    @ApiDescription("Lấy danh sách các quyền")
    public ResponseEntity<Page<PermissionDTO>> getAllPermissions(
            @PageableDefault(page = 0, size = 20) Pageable pageable) {
        Page<PermissionDTO> roles = this.permissionService.getAllPermissions(PermissionDTO.class, pageable); // Placeholder
                                                                                                             // response
        return ResponseEntity.ok(roles);

    }

    @GetMapping("/{id}")
    public ResponseEntity<PermissionDTO> getPermission(@PathVariable Long id) {
        PermissionDTO permission = permissionService.getPermissionById(id, PermissionDTO.class);
        return ResponseEntity.ok(permission);
    }
}
