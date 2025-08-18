package com.minh.shopee.domain.dto.response.projection;

import java.math.BigDecimal;
import java.util.List;

import com.minh.shopee.domain.model.ProductImage;

public interface ProductProjection {
    Long getId();

    String getName();

    String getDescription();

    BigDecimal getPrice();

    Integer getStock();

    List<ProductImage> getImages();

    CategoryName getCategory();

    ShopId getShop();

    interface ShopId {
        Long getId();
    }

    interface CategoryName {
        String getName();
    }
}
