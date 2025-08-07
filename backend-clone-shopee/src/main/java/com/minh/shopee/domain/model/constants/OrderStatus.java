package com.minh.shopee.domain.model.constants;

public enum OrderStatus {
    PENDING("Đang chờ"),
    PROCESSING("Đang xử lý"),
    SHIPPING("Đang giao"),
    DELIVERED("Đã giao"),
    CANCELED("Đã hủy"),
    RETURNED("Đã trả");

    private final String displayName;

    OrderStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}