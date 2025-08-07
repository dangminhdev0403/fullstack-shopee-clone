package com.minh.shopee.domain.dto.response.carts;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CartDTO {
    List<CartDetailDTO> cartDetails;

}
