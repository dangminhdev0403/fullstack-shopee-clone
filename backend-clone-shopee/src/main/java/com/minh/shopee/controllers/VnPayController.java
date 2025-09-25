package com.minh.shopee.controllers;

import java.io.UnsupportedEncodingException;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.minh.shopee.domain.constant.ApiRoutes;
import com.minh.shopee.services.utils.VnPayService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiRoutes.API_BASE_V1 + "/vnpay")
public class VnPayController {

    private final VnPayService vnPayService;

    @PostMapping("/pay")
    public ResponseEntity<Map<String, Object>> createPayment(HttpServletRequest req,
            @RequestParam("amount") int amount,
            @RequestParam("orderInfo") String orderInfo,
            @RequestParam(value = "bankCode", required = false) String bankCode,
            @RequestParam(value = "language", required = false, defaultValue = "vn") String language,
            @RequestParam(value = "orderType", defaultValue = "other") String orderType,
            HttpServletRequest request) {

        // Response JSON
        Map<String, Object> response = this.vnPayService.createPayment(amount, orderType, language, bankCode, request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/return")
    public ResponseEntity<String> vnPayReturn(HttpServletRequest request) throws UnsupportedEncodingException {

        // Trả HTML để frontend nhận qua postMessage
        String html = this.vnPayService.vnPayReturn(request);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "text/html")
                .body(html);
    }
}
