package com.minh.shopee.controllers.products;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minh.shopee.domain.constant.ApiRoutes;
import com.minh.shopee.domain.dto.request.CreateOrderRequest;
import com.minh.shopee.domain.dto.request.UpdateOrderDTO;
import com.minh.shopee.domain.dto.response.projection.OrderProjection;
import com.minh.shopee.services.OrderService;
import com.minh.shopee.services.utils.SecurityUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(ApiRoutes.API_BASE_V1 + ApiRoutes.ORDERS)
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping(ApiRoutes.CHECKOUT)
    public ResponseEntity<CreateOrderRequest> checkout(@RequestBody @Valid CreateOrderRequest entity) {

        Long userId = SecurityUtils.getCurrentUserId();
        this.orderService.createOrder(entity, userId);
        return ResponseEntity.ok(entity);

    }

    @GetMapping("")
    public ResponseEntity<Page<OrderProjection>> getMethodName(
            @PageableDefault(page = 0, size = 20) Pageable pageable) {
        Page<OrderProjection> orders = orderService.getOrdersListByUser(pageable);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("")
    public ResponseEntity<String> cancelOrder(@Valid @RequestBody UpdateOrderDTO req) {

        return ResponseEntity.ok("Huỷ đơn hàng thành công");
    }
}
