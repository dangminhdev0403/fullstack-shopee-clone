package com.minh.shopee.services;

import com.minh.shopee.domain.dto.request.CreateShopDTO;

public interface ShopService {

    void createShop(CreateShopDTO request, Long userId);
}
