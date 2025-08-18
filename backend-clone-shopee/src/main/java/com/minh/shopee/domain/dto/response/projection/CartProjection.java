package com.minh.shopee.domain.dto.response.projection;

import java.math.BigDecimal;
import java.util.List;

public interface CartProjection {
    List<CartDetailProjection> getCartDetails();

    public interface CartDetailProjection {
        Long getId();

        Integer getQuantity();

        Product getProduct();

        interface Product {
            Long getId();

            ShopId getShop();

            String getName();

            BigDecimal getPrice();

            Integer getStock();

            List<ProductImageProjection> getImages();

            interface ShopId {
                Long getId();
            }

            interface ProductImageProjection {
                Long getId();

                String getImageUrl(); // ví dụ field trong ProductImage
            }

        }
    }
}
