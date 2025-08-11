package com.minh.shopee.domain.dto.response.projection;

public interface PermissionProjection {
    Long getId();

    String getPath();

    String getMethod();

    String getDescrition();
}
