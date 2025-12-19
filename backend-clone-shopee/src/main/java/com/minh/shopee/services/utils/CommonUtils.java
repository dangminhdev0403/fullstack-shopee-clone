package com.minh.shopee.services.utils;

import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minh.shopee.domain.dto.response.ResponseData;

import jakarta.servlet.http.HttpServletResponse;

public class CommonUtils {
    private static ObjectMapper objectMapper; // Dùng để trả JSON response

    public static String[] getNullPropertyNames(Object source) {
        try {
            final Set<String> emptyNames = new HashSet<>();
            for (PropertyDescriptor pd : Introspector.getBeanInfo(source.getClass(), Object.class)
                    .getPropertyDescriptors()) {
                Object value = pd.getReadMethod().invoke(source);
                if (value == null) {
                    emptyNames.add(pd.getName());
                }
            }
            return emptyNames.toArray(new String[0]);
        } catch (Exception e) {
            throw new RuntimeException("Error while getting null properties", e);
        }
    }

    public static void writeErrorResponse(HttpServletResponse response, HttpStatus status, String message)
            throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(status.value());
        ResponseData<Object> data = ResponseData.<Object>builder()
                .status(status.value())
                .data(null)
                .error(String.valueOf(status.value()))
                .message(message)
                .build();
        response.getWriter().write(objectMapper.writeValueAsString(data));
    }
}
