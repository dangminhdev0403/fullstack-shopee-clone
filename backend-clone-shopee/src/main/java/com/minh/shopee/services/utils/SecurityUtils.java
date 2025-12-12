package com.minh.shopee.services.utils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import com.minh.shopee.domain.dto.response.users.ResLoginDTO;
import com.minh.shopee.services.utils.error.AppException;

import lombok.extern.slf4j.Slf4j;

/**
 * Utility class cho việc thao tác với JWT và Spring Security.
 * <p>
 * Các chức năng chính:
 * <ul>
 * <li>Tạo AccessToken và RefreshToken</li>
 * <li>Xác thực token</li>
 * <li>Lấy thông tin user từ SecurityContext (email, id, quyền...)</li>
 * <li>Kiểm tra quyền (authorities) của user hiện tại</li>
 * </ul>
 */
@Service
@Slf4j(topic = "SecurityUtils")
public class SecurityUtils {
    public static final MacAlgorithm MAC_ALGORITHM = MacAlgorithm.HS512; // Thuật toán ký JWT

    private final JwtEncoder accessTokenEncoder;
    private final JwtEncoder refreshTokenEncoder;
    private final String jwtKey;
    private final String refreshJwtKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    /**
     * Constructor: inject các encoder và key từ application.yml
     */
    public SecurityUtils(
            @Qualifier("accessTokenEncoder") JwtEncoder accessTokenEncoder,
            @Qualifier("refreshTokenEncoder") JwtEncoder refreshTokenEncoder,
            @Value("${minh.jwt.access-token.secret}") String jwtKey,
            @Value("${minh.jwt.refresh-token.secret}") String refreshJwtKey,
            @Value("${minh.jwt.access-token.validity}") long accessTokenExpiration,
            @Value("${minh.jwt.refresh-token.validity}") long refreshTokenExpiration) {
        this.accessTokenEncoder = accessTokenEncoder;
        this.refreshTokenEncoder = refreshTokenEncoder;
        this.jwtKey = jwtKey;
        this.refreshJwtKey = refreshJwtKey;
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    /**
     * Tạo SecretKey cho AccessToken từ key base64 trong cấu hình.
     */
    private SecretKey getAccessTokenSecretKey() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtKey);
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, MAC_ALGORITHM.getName());
    }

    /**
     * Tạo SecretKey cho RefreshToken từ key base64 trong cấu hình.
     */
    private SecretKey getRefreshTokenSecretKey() {
        byte[] keyBytes = Base64.getDecoder().decode(refreshJwtKey);
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, MAC_ALGORITHM.getName());
    }

    /**
     * Hàm chung để tạo JWT.
     *
     * @param email             email/username của user
     * @param userClaim         thông tin user (id, name, role...)
     * @param expirationSeconds thời gian hết hạn
     * @param encoder           encoder dùng để ký token
     * @return JWT dạng String
     */
    private String createToken(String email, Object userClaim, long expirationSeconds, JwtEncoder encoder) {
        Instant now = Instant.now();
        Instant validity = now.plus(expirationSeconds, ChronoUnit.SECONDS);

        log.debug("Creating token for email: {}, expires at: {}", email, validity);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .claim("permission", "ROLE_USER") // có thể custom thêm roles
                .subject(email) // subject = email
                .claim("user", userClaim) // nhúng thêm thông tin user
                .build();

        JwsHeader jwsHeader = JwsHeader.with(MAC_ALGORITHM).build();
        return encoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    /**
     * Tạo AccessToken.
     */
    public String createAccessToken(String email, ResLoginDTO.UserLogin resLoginDTO) {
        log.info("Generating Access Token for {}", email);
        return createToken(email, resLoginDTO, accessTokenExpiration, accessTokenEncoder);
    }

    /**
     * Tạo RefreshToken.
     */
    public String createRefreshToken(String email, ResLoginDTO resLoginDTO) {
        log.info("Generating Refresh Token for {}", email);
        return createToken(email, resLoginDTO.getUser(), refreshTokenExpiration, refreshTokenEncoder);
    }

    /**
     * Kiểm tra và decode AccessToken.
     *
     * @throws IllegalArgumentException nếu token không hợp lệ
     */
    public Jwt validateAccessToken(String token) {
        log.debug("Validating Access Token...");
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getAccessTokenSecretKey())
                .macAlgorithm(MAC_ALGORITHM).build();
        try {
            return jwtDecoder.decode(token);
        } catch (Exception e) {
            log.error("Access Token validation failed: {}", e.getMessage());
            throw new IllegalArgumentException("Invalid access token", e);
        }
    }

    /**
     * Kiểm tra và decode RefreshToken.
     *
     * @throws IllegalArgumentException nếu token không hợp lệ
     */
    public Jwt checkValidRefreshToken(String token) {
        log.debug("Validating Refresh Token...");
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getRefreshTokenSecretKey())
                .macAlgorithm(MAC_ALGORITHM).build();
        try {
            return jwtDecoder.decode(token);
        } catch (Exception e) {
            log.error("Refresh Token validation failed: {}", e.getMessage());
            throw new IllegalArgumentException("Invalid refresh token", e);
        }
    }

    /**
     * Lấy email/username của user hiện tại từ SecurityContext.
     */
    public static Optional<String> getCurrentUserLogin() {
        SecurityContext context = SecurityContextHolder.getContext();
        String user = extractPrincipal(context.getAuthentication());
        log.debug("Current user login: {}", user);
        return Optional.ofNullable(user);
    }

    /**
     * Trích xuất username/email từ đối tượng Authentication.
     */
    private static String extractPrincipal(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        } else if (authentication.getPrincipal() instanceof String s) {
            return s;
        }
        return null;
    }

    /**
     * Lấy JWT hiện tại (token string) từ SecurityContext.
     */
    public static Optional<String> getCurrentUserJWT() {
        SecurityContext context = SecurityContextHolder.getContext();
        return Optional.ofNullable(context.getAuthentication())
                .filter(auth -> auth.getCredentials() instanceof String)
                .map(auth -> {
                    log.debug("Current JWT: {}", auth.getCredentials());
                    return (String) auth.getCredentials();
                });
    }

    /**
     * Kiểm tra user hiện tại có bất kỳ quyền nào trong danh sách cho trước không.
     */
    public static boolean hasCurrentUserAnyOfAuthorities(String... authorities) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean result = (auth != null && getAuthorities(auth)
                .anyMatch(authority -> Arrays.asList(authorities).contains(authority)));
        log.debug("User has any of authorities {}: {}", Arrays.toString(authorities), result);
        return result;
    }

    /**
     * Kiểm tra user hiện tại KHÔNG có bất kỳ quyền nào trong danh sách.
     */
    public static boolean hasCurrentUserNoneOfAuthorities(String... authorities) {
        boolean result = !hasCurrentUserAnyOfAuthorities(authorities);
        log.debug("User has none of authorities {}: {}", Arrays.toString(authorities), result);
        return result;
    }

    /**
     * Kiểm tra user hiện tại có quyền cụ thể nào đó hay không.
     */
    public static boolean hasCurrentUserThisAuthority(String authority) {
        boolean result = hasCurrentUserAnyOfAuthorities(authority);
        log.debug("User has authority [{}]: {}", authority, result);
        return result;
    }

    /**
     * Lấy danh sách quyền từ Authentication.
     */
    private static Stream<String> getAuthorities(Authentication auth) {
        return auth.getAuthorities().stream().map(GrantedAuthority::getAuthority);
    }

    /**
     * Lấy ID của user hiện tại từ JWT (claim "user.id").
     *
     * @return userId nếu tồn tại trong token
     * @throws AppException nếu không thể tìm thấy id
     */
    public static Long getCurrentUserId() {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Map<String, Object> userClaim = jwtAuth.getToken().getClaim("user");

            if (userClaim != null && userClaim.containsKey("id")) {
                return Long.valueOf(userClaim.get("id").toString());
            }
        }

        throw new AppException(401, "Unauthorized", "Không thể lấy thông tin người dùng từ token");
    }

    public Authentication getAuthentication(String token) {
        try {
            Jwt jwt = validateAccessToken(token);

            return new JwtAuthenticationToken(
                    jwt,
                    jwt.getClaimAsStringList("permission") != null
                            ? jwt.getClaimAsStringList("permission").stream()
                                    .map(role -> (GrantedAuthority) () -> role)
                                    .toList()
                            : List.of());
        } catch (Exception e) {
            log.error("JWT authentication error: {}", e.getMessage());
            return null;
        }
    }
}
