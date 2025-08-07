package com.minh.shopee.config;

import java.util.Base64;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import com.minh.shopee.services.utils.SecurityUtils;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

@Configuration
public class JWTConfiguration {
    private static final Logger logger = LoggerFactory.getLogger(JWTConfiguration.class);

    private final String jwtKey;
    private final String refreshJwtKey;

    // Constructor injection cho các giá trị từ properties
    public JWTConfiguration(
            @Value("${minh.jwt.base64.secret}") String jwtKey,
            @Value("${minh.jwt.base64.secret.refresh}") String refreshJwtKey) {
        this.jwtKey = jwtKey;
        this.refreshJwtKey = refreshJwtKey;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ! Nạp quyền từ JWT
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("permission");
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getSecretKey(jwtKey))
                .macAlgorithm(SecurityUtils.MAC_ALGORITHM).build();
        return token -> {
            try {
                return jwtDecoder.decode(token);
            } catch (Exception e) {
                logger.error("JWT Decode Error: {}", e.getMessage(), e);
                throw e;
            }
        };
    }

    @Bean(name = "accessTokenEncoder")
    public JwtEncoder accessTokenEncoder() {
        SecretKey secretKey = getSecretKey(jwtKey);
        JWKSource<SecurityContext> jwkSource = new ImmutableSecret<>(secretKey);
        return new NimbusJwtEncoder(jwkSource);
    }

    @Bean(name = "refreshTokenEncoder")
    public JwtEncoder refreshTokenEncoder() {
        SecretKey secretKey = getSecretKey(refreshJwtKey);
        JWKSource<SecurityContext> jwkSource = new ImmutableSecret<>(secretKey);
        return new NimbusJwtEncoder(jwkSource);
    }

    private SecretKey getSecretKey(String base64Key) {
        byte[] keyBytes = Base64.getDecoder().decode(base64Key);
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, SecurityUtils.MAC_ALGORITHM.getName());
    }
}
