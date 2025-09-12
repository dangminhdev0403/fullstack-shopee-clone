package com.minh.shopee.controllers.admin;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minh.shopee.domain.anotation.ApiDescription;
import com.minh.shopee.domain.constant.ApiRoutes;
import com.minh.shopee.domain.constant.OrderStatus;
import com.minh.shopee.domain.dto.request.OrderShopUpdateDTO;
import com.minh.shopee.domain.dto.request.filters.FilterOrderAdmin;
import com.minh.shopee.domain.dto.response.OverviewOrderDTO;
import com.minh.shopee.domain.dto.response.projection.admin.OrderShopProjection;
import com.minh.shopee.domain.model.OrderDetail;
import com.minh.shopee.services.OrderService;
import com.minh.shopee.services.utils.error.AppException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController("orderAdminController")
@RequestMapping(ApiRoutes.ORDERS)
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    record OrderStatusResponse(int id, String name) {
    }

    // ==============================GET==============================
    @GetMapping("")
    @ApiDescription("Lấy danh sách đơn hàng")
    public ResponseEntity<Page<OrderShopProjection>> getOrderList(
            @PageableDefault(page = 0, size = 20) Pageable pageable, @ModelAttribute FilterOrderAdmin filter) {
        try {
            Page<OrderShopProjection> page = orderService.getOrderDetailsListByShop(
                    pageable, OrderShopProjection.class, filter);
            return ResponseEntity.ok(page);
        } catch (NoSuchMethodException e) {
            throw new AppException(400, "Projection class không hợp lệ", e);
        }
    }

    @GetMapping("/statuses")
    @ApiDescription("Lấy danh sách trạng thái đơn hàng")
    public List<OrderStatusResponse> getOrderStatuses() {
        return Arrays.stream(OrderStatus.values())
                .map(s -> new OrderStatusResponse(
                        s.ordinal(), // số thứ tự: 0, 1, 2, ...
                        s.getDisplayName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/overview")
    @ApiDescription("Lấy báo cáo doanh thu")
    public ResponseEntity<OverviewOrderDTO> overviewOrder() {
        return ResponseEntity.ok(this.orderService.overviewOrder());
    }

    // ==============================PUT==============================
    @PutMapping("")
    @ApiDescription("Cập nhật đơn hàng")
    public ResponseEntity<OrderDetail> updateOrder(@RequestBody @Valid OrderShopUpdateDTO entity) {

        return ResponseEntity.ok(this.orderService.updateOrderByShop(entity));
    }
}
