package com.minh.shopee.controllers.admin;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minh.shopee.domain.anotation.ApiDescription;
import com.minh.shopee.domain.constant.ApiRoutes;
import com.minh.shopee.domain.dto.request.ShopUpdateStatusDTO;
import com.minh.shopee.domain.dto.request.UpdateOrderDTO;
import com.minh.shopee.domain.dto.request.UpdateShopDTO;
import com.minh.shopee.domain.dto.response.projection.OrderProjection;
import com.minh.shopee.domain.model.Order;
import com.minh.shopee.services.ShopService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController("adminShopController")
@RequestMapping(ApiRoutes.SHOPS)
@RequiredArgsConstructor
public class ShopController {
    private final ShopService shopService;

    @PutMapping("/update-status")
    @ApiDescription("Cập nhật trạng thái cửa hàng")
    public ResponseEntity<String> updateShopStatus(@RequestBody @Valid ShopUpdateStatusDTO entity) {
        this.shopService.updateShopStatus(entity);
        return ResponseEntity.ok("Cập nhật thành công ");

    }

    @PutMapping("/update")
    @ApiDescription("Cập nhật thông tin cửa hàng")
    public ResponseEntity<String> updateShop(@RequestBody @Valid UpdateShopDTO entity) {
        this.shopService.updateShop(entity);
        return ResponseEntity.ok("Cập nhật thành công ");

    }

    @GetMapping(ApiRoutes.ORDERS)
    @ApiDescription("Lấy danh sách đơn hàng")
    public ResponseEntity<Page<OrderProjection>> getOrdersList(
            @PageableDefault(page = 0, size = 20) Pageable pageable) {
        Page<OrderProjection> orders = shopService.getOrdersList(pageable);
        return ResponseEntity.ok(orders);
    }

    @PutMapping(ApiRoutes.ORDERS)
    @ApiDescription("Cập nhật  đơn hàng")
    public ResponseEntity<Order> updateOrder(@RequestBody @Valid UpdateOrderDTO entity) {
        Order order = this.shopService.updateOrder(entity);
        return ResponseEntity.ok(order);
    }

}
