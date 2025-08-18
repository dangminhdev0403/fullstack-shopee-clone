package com.minh.shopee.domain.dto.mappers;

import java.util.List;

import com.minh.shopee.domain.dto.response.carts.CartDTO;
import com.minh.shopee.domain.dto.response.carts.CartDetailDTO;
import com.minh.shopee.domain.dto.response.products.ProductResDTO;
import com.minh.shopee.domain.dto.response.projection.CartProjection;
import com.minh.shopee.domain.model.Product;

public class CartMapper {
    public static CartDTO toCartDTO(CartProjection cartProjection) {
        CartDTO dto = new CartDTO();

        List<CartDetailDTO> cartDetailDTOs = cartProjection.getCartDetails().stream()
                .map(detail -> {
                    CartDetailDTO detailDTO = new CartDetailDTO();
                    detailDTO.setId(detail.getId());
                    detailDTO.setQuantity(detail.getQuantity());

                    // Map product
                    ProductResDTO productDTO = ProductResDTO.builder()
                            .id(detail.getProduct().getId())
                            .name(detail.getProduct().getName()) // Projection chưa có getName(), nếu cần thì bổ sung
                            .price(detail.getProduct().getPrice()) // tương tự
                            .stock(detail.getProduct().getStock()) // tương tự
                            .shop(toShop(detail.getProduct().getShop()))
                            .imageUrl(
                                    detail.getProduct().getImages() != null
                                            && !detail.getProduct().getImages().isEmpty()
                                                    ? detail.getProduct().getImages().get(0).getImageUrl()
                                                    : null)
                            .build();

                    detailDTO.setProduct(productDTO);
                    return detailDTO;
                })
                .toList();

        dto.setCartDetails(cartDetailDTOs);
        return dto;
    }

    private static ProductResDTO.ShopDTO toShop(CartProjection.CartDetailProjection.Product.ShopId shopProjection) {
        if (shopProjection == null)
            return null;
        ProductResDTO.ShopDTO shop = new ProductResDTO.ShopDTO();
        shop.setId(shopProjection.getId());
        return shop;
    }

    private static ProductResDTO toProductResDTO(Product product) {
        ProductResDTO dto = new ProductResDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setImageUrl(product.getImages().isEmpty() ? null : product.getImages().get(0).getImageUrl());
        dto.setStock(product.getStock());
        return dto;
    }
}
