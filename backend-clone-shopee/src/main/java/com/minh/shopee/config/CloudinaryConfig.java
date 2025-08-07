package com.minh.shopee.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

@Configuration
public class CloudinaryConfig {
    @Value("${minh.cloudinary.cloud_name}")
    String cloudName;
    @Value("${minh.cloudinary.api_key}")
    String apiKey;
    @Value("${minh.cloudinary.api_secret}")
    String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName); // <== Cloud name từ API key của bạn
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        return new Cloudinary(config);
    }

}
