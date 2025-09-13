package com.minh.shopee.domain.constant;

public enum PaymentMethod {
    COD("Tiền mặt"),
    VNPAY("VNPAY");

    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
