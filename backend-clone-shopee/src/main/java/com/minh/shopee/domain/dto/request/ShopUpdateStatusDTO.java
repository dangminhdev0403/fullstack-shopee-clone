package com.minh.shopee.domain.dto.request;

import com.minh.shopee.domain.base.ShopStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ShopUpdateStatusDTO {

    @NotNull(message = "Id is required")
    private long id;
    private ShopStatus status;

}
