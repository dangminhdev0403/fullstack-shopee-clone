package com.minh.shopee.services.utils;

import java.lang.reflect.Method;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.minh.shopee.domain.anotation.ApiDescription;
import com.minh.shopee.domain.dto.response.ResponseData;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@SuppressWarnings("rawtypes")
@RestControllerAdvice
@Slf4j(topic = "FormatResponse")
@RequiredArgsConstructor

public class FormatResponse implements ResponseBodyAdvice<Object> {

    private final ObjectMapper objectMapper;

    @Override

    public boolean supports(@SuppressWarnings("null") MethodParameter returnType,
            @SuppressWarnings("null") Class converterType) {
        return true;
    }

    @Override
    @Nullable
    public Object beforeBodyWrite(@SuppressWarnings("null") Object body,
            @SuppressWarnings("null") MethodParameter returnType,
            @SuppressWarnings("null") MediaType selectedContentType,
            @SuppressWarnings("null") Class selectedConverterType,
            @SuppressWarnings("null") ServerHttpRequest request,
            @SuppressWarnings("null") ServerHttpResponse response) {

        HttpServletResponse httpResponse = null;
        if (response instanceof ServletServerHttpResponse servletResponse) {
            httpResponse = servletResponse.getServletResponse();
        }

        int statusCode = httpResponse != null ? httpResponse.getStatus() : 200;

        @SuppressWarnings("null")
        String methodName = returnType.getMethod() != null ? returnType.getMethod().getName() : "Unknown";
        String path = request.getURI().getPath();

        log.debug("Intercepting response for path: {}, method: {}, status: {}", path, methodName, statusCode);
        boolean isSwaggerRequest = path.contains("swagger") || path.contains("v3/api-docs");
        if (statusCode >= 400 || isSwaggerRequest) {
            log.debug("Skipping formatting for response. Status: {}, body type: {}", statusCode,
                    body != null ? body.getClass().getSimpleName() : "null");
            return body;
        }

        if (body instanceof String stringBody) {
            try {
                ResponseData<String> wrapper = ResponseData.<String>builder()
                        .status(statusCode)
                        .message("OK")
                        .data(stringBody)
                        .build();
                return objectMapper.writeValueAsString(wrapper);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize response", e);
            }
        }

        Method method = returnType.getMethod();
        ApiDescription apiDescription = method != null ? method.getAnnotation(ApiDescription.class) : null;
        String messageApi = apiDescription != null ? apiDescription.value() : "CALL API THÀNH CÔNG";

        ResponseData<Object> wrappedResponse = ResponseData.<Object>builder()
                .status(statusCode)
                .message(messageApi)
                .data(body)
                .build();

        log.info("Formatted response for [{} {}] with message: {}", request.getMethod(), path, messageApi);

        return wrappedResponse;
    }
}
