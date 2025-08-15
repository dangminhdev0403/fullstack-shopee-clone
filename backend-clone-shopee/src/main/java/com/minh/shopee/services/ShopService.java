package com.minh.shopee.services;

import com.minh.shopee.domain.dto.request.CreateShopDTO;
import com.minh.shopee.domain.dto.request.ShopUpdateStatusDTO;
import com.minh.shopee.domain.dto.request.UpdateShopDTO;

public interface ShopService {

    void createShop(CreateShopDTO request, Long userId);

    void updateShopStatus(ShopUpdateStatusDTO request);

    void updateShop(UpdateShopDTO request);
}
