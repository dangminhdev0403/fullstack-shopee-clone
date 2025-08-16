package com.minh.shopee.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.minh.shopee.domain.dto.request.CreateShopDTO;
import com.minh.shopee.domain.dto.request.ShopUpdateStatusDTO;
import com.minh.shopee.domain.dto.request.UpdateOrderDTO;
import com.minh.shopee.domain.dto.request.UpdateShopDTO;
import com.minh.shopee.domain.dto.response.projection.OrderProjection;
import com.minh.shopee.domain.model.Order;

public interface ShopService {

    void createShop(CreateShopDTO request, Long userId);

    void updateShopStatus(ShopUpdateStatusDTO request);

    void updateShop(UpdateShopDTO request);

    Page<OrderProjection> getOrdersList(Pageable pageable);

    Order updateOrder(UpdateOrderDTO req);
}
