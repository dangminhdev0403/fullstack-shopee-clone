package com.minh.shopee.controllers.products;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minh.shopee.domain.constant.ApiRoutes;
import com.minh.shopee.domain.dto.request.CreateOrderRequest;
import com.minh.shopee.services.OrderService;
import com.minh.shopee.services.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(ApiRoutes.API_BASE_V1 + ApiRoutes.CHECKOUT)
@RequiredArgsConstructor
public class CheckOutController {
    private final OrderService orderService;

    @PostMapping("")
    public ResponseEntity<CreateOrderRequest> checkout(@RequestBody CreateOrderRequest entity) {

        Long userId = SecurityUtils.getCurrentUserId();
        this.orderService.createOrder(entity, userId);

        return ResponseEntity.ok(entity);

    }

}
