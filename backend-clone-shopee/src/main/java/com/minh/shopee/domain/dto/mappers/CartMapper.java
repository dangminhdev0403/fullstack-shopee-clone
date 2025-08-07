package com.minh.shopee.domain.dto.mappers;

import java.util.List;

import com.minh.shopee.domain.dto.response.carts.CartDTO;
import com.minh.shopee.domain.dto.response.carts.CartDetailDTO;
import com.minh.shopee.domain.dto.response.products.ProductResDTO;
import com.minh.shopee.domain.model.Cart;
import com.minh.shopee.domain.model.CartDetail;
import com.minh.shopee.domain.model.Product;

public class CartMapper {

    public static CartDTO toCartDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        List<CartDetailDTO> cartDetailDTOs = cart.getCartDetails().stream()
                .map(CartMapper::toCartDetailDTO)
                .toList();
        dto.setCartDetails(cartDetailDTOs);
        return dto;
    }

    private static CartDetailDTO toCartDetailDTO(CartDetail detail) {
        CartDetailDTO dto = new CartDetailDTO();
        dto.setId(detail.getId());
        dto.setQuantity(detail.getQuantity());
        dto.setProduct(toProductResDTO(detail.getProduct()));
        return dto;
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
