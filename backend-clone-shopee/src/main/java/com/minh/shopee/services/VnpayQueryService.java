package com.minh.shopee.services;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class VnpayQueryService {

    private static final String VNP_TMN_CODE = "X69NK85M"; // Mã website của merchant trên VNPAY
    private static final String VNP_HASH_SECRET = "R8TBKWA3Q10F2RCRWGRZHT6205124ZMS"; // Chuỗi bí mật ký hash
    private static final String VNP_API_URL = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

    public String queryDr(String orderId, String transDate) throws Exception {
        // Build params
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "querydr");
        vnp_Params.put("vnp_TmnCode", VNP_TMN_CODE);

        // requestId thường random, unique
        String requestId = String.valueOf(System.currentTimeMillis());
        vnp_Params.put("vnp_RequestId", requestId);

        vnp_Params.put("vnp_TxnRef", orderId); // Mã đơn hàng của bạn
        vnp_Params.put("vnp_OrderInfo", "Truy van don hang:" + orderId);
        vnp_Params.put("vnp_TransactionDate", transDate); // Ngày giao dịch gốc khi tạo thanh toán: yyyyMMddHHmmss

        String createDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        vnp_Params.put("vnp_CreateDate", createDate);

        vnp_Params.put("vnp_IpAddr", "127.0.0.1"); // IP của khách hàng

        // Sort tham số
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                // Build data
                hashData.append(fieldName).append('=').append(fieldValue);
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                if (i != fieldNames.size() - 1) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }

        // Ký SHA256
        String vnp_SecureHash = hmacSHA512(VNP_HASH_SECRET, hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);

        // Log để debug
        System.out.println("=== VNPAY Request ===");
        System.out.println(hashData);
        System.out.println("SecureHash=" + vnp_SecureHash);

        // Gọi API
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> requestEntity = new HttpEntity<>(query.toString(), headers);
        ResponseEntity<String> response = restTemplate.exchange(
                VNP_API_URL, HttpMethod.POST, requestEntity, String.class);

        System.out.println("=== VNPAY Response ===");
        System.out.println(response.getBody());

        return response.getBody();
    }

    private String hmacSHA512(String key, String data) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-512");
        md.update(key.getBytes(StandardCharsets.UTF_8));
        byte[] digest = md.digest(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : digest) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}