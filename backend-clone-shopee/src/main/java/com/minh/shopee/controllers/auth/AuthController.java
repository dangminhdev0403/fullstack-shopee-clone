package com.minh.shopee.controllers.auth;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.minh.shopee.domain.anotation.ApiDescription;
import com.minh.shopee.domain.dto.request.LoginRequest;
import com.minh.shopee.domain.dto.request.UserResgisterDTO;
import com.minh.shopee.domain.dto.response.projection.RoleProjection;
import com.minh.shopee.domain.dto.response.projection.UserLoginProjection;
import com.minh.shopee.domain.dto.response.rbac.RoleDTO;
import com.minh.shopee.domain.dto.response.users.ResLoginDTO;
import com.minh.shopee.domain.model.Role;
import com.minh.shopee.domain.model.User;
import com.minh.shopee.services.UserService;
import com.minh.shopee.services.utils.SecurityUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j(topic = "AuthController")
public class AuthController {
        private final UserService userService;
        private final SecurityUtils securityUtils;
        private final AuthenticationManagerBuilder authenticationManagerBuilder;

        private static final String REFRESH_TOKEN = "refresh_token";
        private static final String HEADER_NAME = "Set-Cookie";

        private Map<String, Instant> refreshTokensRequestTime = new ConcurrentHashMap<>();
        private Duration refreshTokenAccessRequestExpiration = Duration.ofSeconds(3);

        @Value("${minh.jwt.refresh-token.validity.in.seconds}")
        private long refreshTokenExpiration;

        @PostMapping("/login")
        @ApiDescription("API Login")
        public ResponseEntity<ResLoginDTO> login(@RequestBody @Valid LoginRequest userRequest) {
                log.info("Login request received for email: {}", userRequest.getEmail());

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                userRequest.getEmail(), userRequest.getPassword());

                Authentication authentication = authenticationManagerBuilder.getObject()
                                .authenticate(authenticationToken);
                log.debug("Authentication successful for email: {}", userRequest.getEmail());

                UserLoginProjection currentUser = userService.findByUsername(userRequest.getEmail(),
                                UserLoginProjection.class);
                String email = currentUser.getEmail();
                ResLoginDTO.UserLogin userLogin = buildUserLogin(
                                currentUser.getId(),
                                currentUser.getEmail(),
                                currentUser.getName(),
                                mapRolesDTO(currentUser.getRoles()));

                String accessToken = this.securityUtils.createAccessToken(userRequest.getEmail(), userLogin);
                log.debug("Access token generated for user: {}", email);

                ResLoginDTO resLoginDTO = ResLoginDTO.builder().accessToken(accessToken).user(userLogin).build();

                SecurityContextHolder.getContext().setAuthentication(authentication);

                String refreshToken = this.securityUtils.createRefreshToken(userRequest.getEmail(), resLoginDTO);
                this.userService.updateRefreshToken(userRequest.getEmail(), refreshToken);
                log.debug("Refresh token generated and saved for user: {}", email);

                ResponseCookie cookie = ResponseCookie.from(
                                REFRESH_TOKEN,
                                refreshToken)
                                .httpOnly(true)
                                .path("/")
                                .maxAge(refreshTokenExpiration).build();

                log.info("Login successful for email: {}", email);
                return ResponseEntity.ok().header(HEADER_NAME, cookie.toString()).body(resLoginDTO);
        }

        @GetMapping("/refresh")
        @ApiDescription("Refresh token")
        public ResponseEntity<ResLoginDTO> refreshToken(
                        @CookieValue(name = "refresh_token", required = false) Optional<String> refreshToken) {

                log.info("Refresh token request received");

                if (refreshToken.isEmpty()) {
                        log.warn("Refresh token not found in request");
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Refresh token not found");
                }

                String tokenValue = refreshToken.get();
                Instant lastRequestTime = this.refreshTokensRequestTime.get(tokenValue);

                if (lastRequestTime != null &&
                                Instant.now().isBefore(lastRequestTime.plus(refreshTokenAccessRequestExpiration))) {
                        log.warn("Too many refresh token requests in short time for token: {}", tokenValue);
                        throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Quá nhiều lần gọi request");
                }

                this.refreshTokensRequestTime.put(tokenValue, Instant.now());

                Jwt decodedToken = this.securityUtils.checkValidRefreshToken(tokenValue);
                String email = decodedToken.getSubject();
                log.debug("Refresh token validated for user: {}", email);

                UserLoginProjection currentUser = userService.findByUsername(
                                email,
                                UserLoginProjection.class);
                ResLoginDTO.UserLogin userLogin = buildUserLogin(
                                currentUser.getId(),
                                currentUser.getEmail(),
                                currentUser.getName(),
                                mapRolesDTO(currentUser.getRoles()));

                String accessToken = this.securityUtils.createAccessToken(email, userLogin);
                ResLoginDTO resLoginDTO = ResLoginDTO.builder().user(userLogin).accessToken(accessToken).build();

                Instant expiresAt = decodedToken.getExpiresAt();
                Instant now = Instant.now();
                Instant beforeexpiresAt = now.plus(5, ChronoUnit.MINUTES);

                if (expiresAt != null && beforeexpiresAt.isAfter(expiresAt)) {
                        log.info("Refresh token is nearing expiry, generating new one for user: {}", email);
                        tokenValue = this.securityUtils.createRefreshToken(email, resLoginDTO);
                        this.userService.updateRefreshToken(email, tokenValue);
                }

                ResponseCookie cookie = ResponseCookie.from(
                                REFRESH_TOKEN,
                                tokenValue)
                                .httpOnly(true)
                                .path("/")
                                .maxAge(refreshTokenExpiration).build();

                log.info("Access token refreshed successfully for user: {}", email);
                return ResponseEntity.ok().header(HEADER_NAME, cookie.toString()).body(resLoginDTO);
        }

        @PostMapping("/logout")
        @ApiDescription("Logout")
        public ResponseEntity<String> logout(
                        @CookieValue(name = REFRESH_TOKEN, required = false) Optional<String> refreshToken) {

                log.info("Logout request received");

                if (refreshToken.isEmpty()) {
                        log.warn("No refresh token found during logout");
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy refresh token");
                }

                Jwt decodedToken = this.securityUtils.checkValidRefreshToken(refreshToken.get());
                String email = decodedToken.getSubject();

                log.debug("Refresh token validated during logout for user: {}", email);

                this.userService.updateRefreshToken(email, null);
                log.info("Refresh token cleared from database for user: {}", email);

                ResponseCookie cookie = ResponseCookie.from(
                                REFRESH_TOKEN,
                                "")
                                .httpOnly(true)
                                .path("/")
                                .maxAge(refreshTokenExpiration).build();

                log.info("User logged out successfully: {}", email);
                return ResponseEntity.ok().header(HEADER_NAME, cookie.toString()).body("Đăng xuất thành công");
        }

        @PostMapping("/register")
        @ApiDescription("API Register")
        public ResponseEntity<ResLoginDTO> register(@RequestBody @Valid UserResgisterDTO userRequest) {
                log.info("Register request received for email: {}", userRequest.getEmail());

                User createUser = userService.createUser(userRequest);

                Set<Role> roles = createUser.getRoles();

                ResLoginDTO.UserLogin userLogin = buildUserLogin(
                                createUser.getId(),
                                createUser.getEmail(),
                                createUser.getName(),
                                mapRoles(roles));
                String email = createUser.getEmail();

                String accessToken = this.securityUtils.createAccessToken(email, userLogin);
                ResLoginDTO resLoginDTO = ResLoginDTO.builder().accessToken(accessToken).user(userLogin).build();

                String refreshToken = this.securityUtils.createRefreshToken(email, resLoginDTO);
                this.userService.updateRefreshToken(email, refreshToken);
                log.info("User registered successfully: {}", email);

                ResponseCookie cookie = ResponseCookie.from(
                                REFRESH_TOKEN,
                                refreshToken)
                                .httpOnly(true)
                                .path("/")
                                .maxAge(refreshTokenExpiration).build();
                return ResponseEntity.ok().header(HEADER_NAME, cookie.toString()).body(resLoginDTO);
        }

        private ResLoginDTO.UserLogin buildUserLogin(
                        Long id, String email, String name, Set<RoleDTO> roles) {
                return ResLoginDTO.UserLogin.builder()
                                .id(id)
                                .email(email)
                                .name(name)
                                .roles(roles)
                                .build();
        }

        private Set<RoleDTO> mapRoles(Set<Role> roles) {
                return roles.stream()
                                .map(r -> {
                                        int permissionCount = r.getPermissions() != null
                                                        ? r.getPermissions().size()
                                                        : 0;

                                        String roleName;
                                        if (permissionCount > 1 || r.getId() == 1) {
                                                roleName = "ROLE_ADMIN";
                                        } else {
                                                roleName = "ROLE_USER";
                                        }

                                        return new RoleDTO(
                                                        r.getId(),
                                                        roleName);
                                })
                                .collect(Collectors.toSet());
        }

        private Set<RoleDTO> mapRolesDTO(Set<? extends RoleProjection> roles) {
                return roles.stream()
                                .map(r -> {
                                        int permissionCount = r.getPermissions() != null
                                                        ? r.getPermissions().size()
                                                        : 0;

                                        String roleName;
                                        if (permissionCount > 1 || r.getId() == 1) {
                                                roleName = "ROLE_ADMIN";
                                        } else {
                                                roleName = "ROLE_USER";
                                        }

                                        return new RoleDTO(r.getId(), roleName);
                                })
                                .collect(Collectors.toSet());
        }

}
