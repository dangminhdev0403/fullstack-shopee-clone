package com.minh.shopee.services.utils.error;

import java.util.List;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.minh.shopee.domain.dto.response.ResponseData;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j(topic = "GlobalExceptionHandler")
public class GlobalExceptionHandler {

    private ResponseData<Object> createResponseData(int status, String error, Object message) {
        return ResponseData.<Object>builder()
                .status(status)
                .error(error)
                .message(message)
                .build();
    }

    @ExceptionHandler(value = Throwable.class)
    public ResponseEntity<ResponseData<Object>> handleAllExceptions(Throwable ex, HttpServletRequest request) {
        int statusCode = HttpStatus.INTERNAL_SERVER_ERROR.value();
        String titleError = ex.getClass().getSimpleName();
        String error = "Lỗi chưa xử lí:" + titleError;
        Object message = ex.getMessage();

        if (ex instanceof MethodArgumentNotValidException e) {
            statusCode = HttpStatus.BAD_REQUEST.value();
            error = "Lỗi validation";
            message = extractFieldErrors(e.getBindingResult());
            log.warn("⚠️ [400 VALIDATION ERROR]   Message: {}", message);
        } else if (ex instanceof NoResourceFoundException) {
            statusCode = HttpStatus.NOT_FOUND.value();
            error = "Endpoint không tồn tại";
            message = "URL " + request.getRequestURL() + " không tồn tại";
            log.warn("⚠️ [404 NOT FOUND] URL: {} | Message: {}", request.getRequestURL(), ex.getMessage());

        } else if (ex instanceof HttpRequestMethodNotSupportedException) {
            statusCode = HttpStatus.METHOD_NOT_ALLOWED.value();
            error = "Method không hỗ trợ";
            message = "Phương thức " + request.getMethod() + " không hỗ trợ";
            log.warn("⚠️ [405 NOT ALLOWED] Method: {} | URL: {}", request.getMethod(), request.getRequestURL());
        } else if (ex instanceof DuplicateException e) {
            statusCode = HttpStatus.CONFLICT.value();
            error = "Trùng dữ liệu";
            message = String.format("%s %s", e.getFieldName(), ex.getMessage());
            log.warn("⚠️ [409 DUPLICATE DATA] Field: {} | URL: {} | Message: {}", e.getFieldName(),
                    request.getRequestURL(), ex.getMessage());
        } else if (ex instanceof DataIntegrityViolationException e) {
            statusCode = HttpStatus.CONFLICT.value();
            error = "Lỗi ràng buộc dữ liệu";
            message = "Lỗi khi thao tác dữ liệu: " + getRootCauseMessage(e);
            log.warn("⚠️ [409 DATA INTEGRITY VIOLATION] URL: {} | Message: {}", request.getRequestURL(), message, e);
        } else if (ex instanceof ResponseStatusException e) {
            statusCode = e.getStatusCode().value();
            error = e.getStatusCode().toString();
            message = e.getReason();
        } else if (ex instanceof BadCredentialsException) {
            statusCode = HttpStatus.UNAUTHORIZED.value();
            error = "Lỗi xác thực";
            message = "Thông tin đăng nhập không chính xác";
            log.warn("⚠️ [401 BadCredentialsException] URL: {} | Message: {}", request.getRequestURL(),
                    ex.getMessage());
        } else if (ex instanceof HttpMessageNotReadableException) {
            statusCode = HttpStatus.BAD_REQUEST.value();
            error = "Lỗi  truyền JSON";
            message = "Chưa truyền hoặc truyền sai Data JSON";
            log.warn("⚠️ [400 HttpMessageNotReadableException] Required request body is missing",
                    request.getRequestURL(),
                    ex.getMessage());
        } else if (ex instanceof AppException e) {
            statusCode = e.getStatus();
            error = e.getError();
            message = e.getMessage();
        }

        else {
            log.error("❌ [COMMON EXCEPTION] URL: {} | Message: {}", request.getRequestURL(), ex.getMessage(), ex);
        }

        ResponseData<Object> response = createResponseData(statusCode, error, message);
        return ResponseEntity.status(statusCode).body(response);
    }

    // Hàm lấy message gốc (root cause)
    private String getRootCauseMessage(Throwable throwable) {
        Throwable root = throwable;
        while (root.getCause() != null && root.getCause() != root) {
            root = root.getCause();
        }
        return root.getMessage();
    }

    private List<Map<String, String>> extractFieldErrors(BindingResult result) {
        return result.getFieldErrors()
                .stream()
                .map(fieldError -> Map.of(fieldError.getField(), fieldError.getDefaultMessage()))
                .toList();
    }

}
