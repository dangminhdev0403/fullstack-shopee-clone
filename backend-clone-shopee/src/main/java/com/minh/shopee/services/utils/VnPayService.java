package com.minh.shopee.services.utils;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.stereotype.Service;

import com.minh.shopee.config.VnPayConfig;
import com.nimbusds.jose.shaded.gson.JsonObject;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j(topic = "VnPayService")
public class VnPayService {

    private final VnPayConfig vnPayConfig;

    public VnPayService(VnPayConfig vnPayConfig) {
        this.vnPayConfig = vnPayConfig;
    }

    /**
     * Gọi API Query transaction của VNPay
     * 
     * @param orderId   mã đơn hàng
     * @param transDate ngày giao dịch (yyyyMMddHHmmss)
     * @param clientIp  địa chỉ IP của client
     * @return JSON string response từ VNPay
     */
    public String queryTransaction(String orderId, String transDate, String clientIp) throws Exception {
        // Build params
        String vnp_RequestId = VnPayConfig.getRandomNumber(8);
        String vnp_Version = "2.1.0";
        String vnp_Command = "querydr";
        String vnp_TmnCode = vnPayConfig.getVnpTmnCode();
        String vnp_TxnRef = orderId;
        String vnp_OrderInfo = "Kiem tra ket qua GD OrderId:" + vnp_TxnRef;

        TimeZone tz = TimeZone.getTimeZone("Asia/Ho_Chi_Minh");
        Calendar cal = Calendar.getInstance(tz);

        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cal.getTime());
        cal.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = new SimpleDateFormat("yyyyMMddHHmmss").format(cal.getTime());
        // JSON body
        JsonObject vnp_Params = new JsonObject();
        vnp_Params.addProperty("vnp_RequestId", vnp_RequestId);
        vnp_Params.addProperty("vnp_Version", vnp_Version);
        vnp_Params.addProperty("vnp_Command", vnp_Command);
        vnp_Params.addProperty("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.addProperty("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.addProperty("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.addProperty("vnp_TransactionDate", transDate);
        vnp_Params.addProperty("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.addProperty("vnp_ExpireDate", vnp_ExpireDate);

        vnp_Params.addProperty("vnp_IpAddr", clientIp);

        // Build secure hash
        String hash_Data = String.join("|",
                vnp_RequestId,
                vnp_Version,
                vnp_Command,
                vnp_TmnCode,
                vnp_TxnRef,
                transDate,
                vnp_CreateDate,
                clientIp,
                vnp_OrderInfo);
        String vnp_SecureHash = VnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hash_Data);
        vnp_Params.addProperty("vnp_SecureHash", vnp_SecureHash);

        // Call API
        URL url = new URL(vnPayConfig.getVnpApiUrl());
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);

        try (DataOutputStream wr = new DataOutputStream(con.getOutputStream())) {
            wr.writeBytes(vnp_Params.toString());
            wr.flush();
        }

        int responseCode = con.getResponseCode();
        System.out.println("Request URL : " + url);
        System.out.println("Post Data   : " + vnp_Params);
        System.out.println("Response Code : " + responseCode);

        // Đọc response
        StringBuilder response = new StringBuilder();
        try (BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()))) {
            String line;
            while ((line = in.readLine()) != null) {
                response.append(line);
            }
        }

        return response.toString();
    }

    public Map<String, Object> createPayment(int amount, String orderType, String language, String bankCode,
            HttpServletRequest request) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        long vnp_Amount = (long) amount * 100;

        String vnp_TxnRef = VnPayConfig.getRandomNumber(8);
        String vnp_IpAddr = VnPayConfig.getIpAddress(request);
        String vnp_TmnCode = vnPayConfig.getVnpTmnCode();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(vnp_Amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);

        if (language != null && !language.isEmpty()) {
            vnp_Params.put("vnp_Locale", language);
        } else {
            vnp_Params.put("vnp_Locale", "vn");
        }

        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getVnpReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // Thời gian tạo & hết hạn
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Tạo query và hash data
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (Iterator<String> itr = fieldNames.iterator(); itr.hasNext();) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                try {
                    hashData.append(fieldName).append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                            .append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }

                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);

        String paymentUrl = vnPayConfig.getVnpPayUrl() + "?" + query.toString();

        // Response JSON
        Map<String, Object> response = new HashMap<>();
        response.put("code", "00");
        response.put("message", "success");
        response.put("data", paymentUrl);
        return response;
    }

    public String vnPayReturn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        Map<String, String[]> params = request.getParameterMap();
        for (Map.Entry<String, String[]> entry : params.entrySet()) {
            fields.put(entry.getKey(), entry.getValue()[0]);
        }

        // Lấy SecureHash từ VNPAY và bỏ khỏi map
        String vnp_SecureHash = fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        // Build raw data để hash lại (phải encode giống lúc tạo paymentUrl)
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String key = fieldNames.get(i);
            String value = fields.get(key);
            if (value != null && !value.isEmpty()) {
                try {
                    sb.append(key)
                            .append('=')
                            .append(URLEncoder.encode(value, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }
                if (i < fieldNames.size() - 1) {
                    sb.append('&');
                }
            }
        }

        // Hash với secretKey
        String signValue = vnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), sb.toString());

        String status;
        String message;

        if (!signValue.equalsIgnoreCase(vnp_SecureHash)) {
            status = "error";
            message = "Invalid signature";
        } else {
            String responseCode = fields.get("vnp_ResponseCode");
            if ("00".equals(responseCode)) {
                status = "success";
                message = "Payment successful";
            } else {
                status = "fail";
                message = "Payment failed or declined (code: " + responseCode + ")";
            }
        }

        log.info("VNPAY RETURN: " + status + " - " + message);

        // Trả HTML để frontend nhận qua postMessage
        return "<html><body>" +
                "<script>" +
                "window.opener.postMessage({status: '" + status + "', message: '" + message + "'}, '*');" +
                "window.close();" +
                "</script>" +
                "</body></html>";
    }

}
