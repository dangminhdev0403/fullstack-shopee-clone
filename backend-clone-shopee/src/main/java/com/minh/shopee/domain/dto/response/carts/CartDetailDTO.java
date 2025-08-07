package com.minh.shopee.domain.dto.response.carts;

import com.minh.shopee.domain.dto.response.products.ProductResDTO;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CartDetailDTO {
    private long id;
    private Integer quantity;
    private ProductResDTO product;
}
 