package com.minh.shopee.domain.base;

public enum ShopStatus {
    PENDING("Đang chờ"),
    APPROVED("Chấp nhận"),
    REJECTED("Từ chối");

    private final String displayName;

    ShopStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
