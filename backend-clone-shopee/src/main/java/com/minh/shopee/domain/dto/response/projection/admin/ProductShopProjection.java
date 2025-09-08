package com.minh.shopee.domain.dto.response.projection.admin;

import java.math.BigDecimal;

public interface ProductShopProjection {
    Long getId();

    String getName();

    String getDescription();

    BigDecimal getPrice();

    Integer getStock();

    CategoryProjection getCategory();

    ProductImageProjection getImages();

    String getStatus();

    interface CategoryProjection {
        Long getId();

        String getName();
    }

    interface ProductImageProjection {
        String getImageUrl();
    }

}
