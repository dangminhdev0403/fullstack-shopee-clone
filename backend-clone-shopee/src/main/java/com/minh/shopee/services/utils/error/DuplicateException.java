package com.minh.shopee.services.utils.error;

public class DuplicateException extends RuntimeException {
    private final String fieldName;

    public DuplicateException(String fieldName, String message) {
        super(message); // <-- Gọi super phải ở dòng đầu tiên
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}
