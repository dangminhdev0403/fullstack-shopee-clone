package com.minh.shopee.controllers.users;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minh.shopee.domain.anotation.ApiDescription;
import com.minh.shopee.domain.constant.ApiRoutes;
import com.minh.shopee.domain.dto.request.CreateShopDTO;
import com.minh.shopee.services.ShopService;
import com.minh.shopee.services.utils.SecurityUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiRoutes.API_BASE_V1 + ApiRoutes.SHOPS)
public class ShopController {

    private final ShopService shopService;

    @PostMapping("")
    @ApiDescription("Gửi request tạo shop")
    public ResponseEntity<String> createShop(@RequestBody @Valid CreateShopDTO request) {
        long userId = SecurityUtils.getCurrentUserId();
        shopService.createShop(request, userId);
        return ResponseEntity.ok("Tạo shop thành công");
    }
}
