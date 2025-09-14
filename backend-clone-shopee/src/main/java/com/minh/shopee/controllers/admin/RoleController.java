package com.minh.shopee.controllers.admin;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minh.shopee.domain.anotation.ApiDescription;
import com.minh.shopee.domain.constant.ApiRoutes;
import com.minh.shopee.domain.dto.request.rbac.RoleRequest;
import com.minh.shopee.domain.dto.response.projection.RoleProjection;
import com.minh.shopee.domain.dto.response.rbac.RoleDTO;
import com.minh.shopee.domain.model.Role;
import com.minh.shopee.services.RoleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(ApiRoutes.ROLES)
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @GetMapping("")
    @ApiDescription("Lấy danh sách các vai trò")

    public ResponseEntity<Page<RoleDTO>> getAllRoles(@PageableDefault(page = 0, size = 20) Pageable pageable) {
        Page<RoleDTO> roles = this.roleService.getAllRoles(RoleDTO.class, pageable);
        return ResponseEntity.ok(roles);

    }

    @PostMapping("")
    @ApiDescription("Tạo vai trò")
    public ResponseEntity<String> createRole(@RequestBody RoleRequest entity) {
        Role roleCreated = this.roleService.createRole(entity);
        return ResponseEntity.ok("Tạo vai trò " + roleCreated.getName() + " thành công ");

    }

    @GetMapping("/{id}")
    @ApiDescription("Lấy vai trò theo ID")
    public ResponseEntity<Role> getRoleById(@PathVariable Long id) {
        Role role = this.roleService.getRoleById(id);
        return ResponseEntity.ok(role);
    }

    @PutMapping("")
    public ResponseEntity<String> putMethodName(@RequestBody RoleRequest entity) {
        this.roleService.updateRole(entity);

        return ResponseEntity.ok("Cập nhật vai trò thành công");
    }

    @DeleteMapping("")
    @ApiDescription("Xoá vai trò")
    public ResponseEntity<String> deleteRole(@RequestBody Role entity) {
        this.roleService.deleteRole(entity.getId());
        return ResponseEntity.ok("Xoá vai trò thành công");
    }

}
