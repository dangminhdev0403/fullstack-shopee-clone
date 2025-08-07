package com.minh.shopee.services.utils.error;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class AppException extends RuntimeException {
    private final int status;
    private final String error;
    private final transient Object message; // Chấp nhận danh sách lỗi (List) hoặc chuỗi lỗi duy nhất

    @SuppressWarnings("unchecked")
    @Override
    public String getMessage() {
        if (message instanceof List<?>) {
            // Nếu message là một danh sách lỗi, trả về chuỗi nối các lỗi lại
            return String.join(", ", (List<String>) message);
        }
        return (String) message; // Trả về message nếu chỉ có một lỗi
    }
}
