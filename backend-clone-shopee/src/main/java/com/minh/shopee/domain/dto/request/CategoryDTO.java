package com.minh.shopee.domain.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class CategoryDTO {
    private Long id;
    private String name;
}
