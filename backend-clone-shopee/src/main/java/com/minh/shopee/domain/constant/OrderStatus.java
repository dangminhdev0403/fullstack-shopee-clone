package com.minh.shopee.domain.constant;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

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

    // check trạng thái có cho phép user hủy không
    public boolean canCancel() {
        return this == PENDING || this == PROCESSING;
    }

    /**
     * Định nghĩa rule chuyển trạng thái hợp lệ
     */
    public boolean canChangeTo(OrderStatus newStatus) {
        switch (this) {
            case PENDING:
                return newStatus == PROCESSING || newStatus == CANCELED;
            case PROCESSING:
                return newStatus == SHIPPING || newStatus == CANCELED;
            case SHIPPING:
                return newStatus == DELIVERED || newStatus == RETURNED;
            case DELIVERED:
                return newStatus == RETURNED; // chỉ có thể trả hàng
            case RETURNED, CANCELED:
                return false; // không thay đổi nữa
            default:
                return false;
        }
    }
     @JsonCreator
    public static OrderStatus from(Object input) {
        if (input == null) return null;

        // Nếu input là số → parse ordinal
        if (input instanceof Integer) {
            int ordinal = (Integer) input;
            if (ordinal >= 0 && ordinal < values().length) {
                return values()[ordinal];
            }
        }

        // Nếu input là string → thử parse số hoặc enum name
        String str = input.toString().trim();
        try {
            int ordinal = Integer.parseInt(str);
            if (ordinal >= 0 && ordinal < values().length) {
                return values()[ordinal];
            }
        } catch (NumberFormatException ignored) {}

        return OrderStatus.valueOf(str.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name(); // serialize ra "DELIVERED"
    }
}