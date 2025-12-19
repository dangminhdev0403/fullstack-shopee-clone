package com.minh.shopee.controllers.users;

import java.util.List;
import java.util.Map;

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
import com.minh.shopee.domain.dto.request.AddAddressDTO;
import com.minh.shopee.domain.dto.request.EditAddressDTO;
import com.minh.shopee.domain.model.Address;
import com.minh.shopee.services.AddressService;
import com.minh.shopee.services.utils.SecurityUtils;
import com.minh.shopee.services.utils.error.AppException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @GetMapping("")
    @ApiDescription("Lấy danh sách địa chỉ")
    public ResponseEntity<List<Address>> getMyAddresses() {
        Map<String, Object> userClaim = SecurityUtils.getCurrentUserClaim();
        if (userClaim != null && userClaim.containsKey("id")) {
            Long userIdLong = Long.valueOf(userClaim.get("id").toString());

            return ResponseEntity.ok().body(this.addressService.getAllAddresses(userIdLong));

        }

        throw new AppException(401, "Unauthorized", "Không thể lấy thông tin người dùng từ token");
    }

    @PostMapping("")
    @ApiDescription("Thêm địa chỉ mới ")
    public ResponseEntity<String> addAddress(@RequestBody @Valid AddAddressDTO request) {
        Long userId = SecurityUtils.getCurrentUserId();
        this.addressService.addAddress(request, userId);
        return ResponseEntity.ok("Thêm địa chỉ thành công");

    }

    @PutMapping("")
    @ApiDescription("Cập nhật địa chỉ")
    public ResponseEntity<String> updateAddress(@RequestBody EditAddressDTO request) {
        if (request.getId() == null) {
            throw new AppException(400, "Bad Request", "ID địa chỉ không được để trống");
        }

        this.addressService.updateAddress(request);
        return ResponseEntity.ok("Cập nhật địa chỉ thành công");

    }

    @DeleteMapping("/{id}")
    @ApiDescription("Xoá địa chỉ")
    public ResponseEntity<String> deleteAddress(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        this.addressService.deleteAddress(id, userId);
        return ResponseEntity.ok("Xoá địa chỉ thành công");
    }

}
