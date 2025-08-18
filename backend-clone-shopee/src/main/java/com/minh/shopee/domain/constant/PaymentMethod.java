package com.minh.shopee.domain.constant;

public enum PaymentMethod {
    COD("Đang chờ"),
    MOMO("Chấp nhận");

    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
