package com.minh.shopee.domain.dto.request;

import com.minh.shopee.domain.constant.QuantityAction;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class AddProductDTO {

    @NotNull(message = "ProductId is required")
    private long productId;

    @NotNull(message = "Quantity is required")
    private Integer quantity;
    @NotNull(message = "Action is required")
    private QuantityAction action;

}