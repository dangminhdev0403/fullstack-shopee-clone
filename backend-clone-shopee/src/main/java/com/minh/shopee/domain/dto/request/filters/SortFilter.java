package com.minh.shopee.domain.dto.request.filters;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SortFilter {

    @Pattern(regexp = "ctime|price|sold", message = "Invalid sort field")
    private String sortBy = "ctime";

    @Pattern(regexp = "asc|desc", message = "Invalid sort order")
    private String order = "asc";

}