package com.minh.shopee.domain.dto.request.filters;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FiltersProductAdmin {

    private String keyword;
    private String categoryId;
    private String sortBy = "id"; // default
}
