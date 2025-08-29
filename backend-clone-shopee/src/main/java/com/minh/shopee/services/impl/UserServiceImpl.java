package com.minh.shopee.services.impl;

import java.io.IOException;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.minh.shopee.domain.dto.request.ChangePassDTO;
import com.minh.shopee.domain.dto.request.UserReqDTO;
import com.minh.shopee.domain.dto.request.UserResgisterDTO;
import com.minh.shopee.domain.dto.response.users.UpdateUserResDTO;
import com.minh.shopee.domain.dto.response.users.UserDTO;
import com.minh.shopee.domain.model.Role;
import com.minh.shopee.domain.model.User;
import com.minh.shopee.domain.specification.UserSpecification;
import com.minh.shopee.repository.GenericRepositoryCustom;
import com.minh.shopee.repository.RoleRepository;
import com.minh.shopee.repository.UserRepository;
import com.minh.shopee.services.UserService;
import com.minh.shopee.services.utils.SecurityUtils;
import com.minh.shopee.services.utils.error.AppException;
import com.minh.shopee.services.utils.error.DuplicateException;
import com.minh.shopee.services.utils.files.UploadCloud;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j(topic = "UserServiceImpl")
@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UploadCloud uploadCloud;
    private final GenericRepositoryCustom<User> userCustomRepo;

    @Override
    public User createUser(UserResgisterDTO user) {
        log.info("Creating user with email: {}", user.getEmail());

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            log.warn("Duplicate user registration attempt for email: {}", user.getEmail());
            throw new DuplicateException(user.getEmail(), "already exists");
        }

        if (StringUtils.hasText(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        User newUser = User.builder()
                .email(user.getEmail())
                .password(user.getPassword())
                .name(user.getName())
                .build();

        log.info("Assigning default role to user: {}", user.getEmail());
        Role defaultRole = roleRepository.findById(3L)
                .orElseThrow(() -> new RuntimeException("Role ID=3 not found"));
        newUser.setRoles(Set.of(defaultRole));

        User savedUser = userRepository.save(newUser);
        log.info("User created successfully with email: {}", savedUser.getEmail());
        return savedUser;
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> {
                    log.warn("User not found with email: {}", username);
                    return new IllegalArgumentException("User not found");
                });
    }

    @Override
    public <T> T findByUsername(String username, Class<T> type) {
        return userRepository.findByEmail(username, type)
                .orElseThrow(() -> {
                    log.warn("User not found with email: {}", username);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
                });
    }

    @Override
    @Transactional
    public void updateRefreshToken(String email, String refreshToken) {
        log.debug("Updating refresh token for user: {}", email);
        int updated = userRepository.updateRefreshTokenByEmail(email, refreshToken);
        if (updated == 0) {
            log.error("Failed to update refresh token - user not found: {}", email);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        log.info("Refresh token updated successfully for user: {}", email);
    }

    @Override
    public User findByEmailAndRefreshToken(String email, String refreshToken) {
        return userRepository.findByEmailAndRefreshToken(email, refreshToken)
                .orElseThrow(() -> {
                    log.warn("User or refresh token not found for email: {}", email);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "User or refresh token not found");
                });
    }

    @Override
    public <T> T findByEmailAndRefreshToken(String email, String refreshToken, Class<T> type) {
        return userRepository.findByEmailAndRefreshToken(email, refreshToken, type)
                .orElseThrow(() -> {
                    log.warn("User or refresh token not found for email: {}", email);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "User or refresh token not found");
                });
    }

    @Override
    public UpdateUserResDTO updateProfile(String email, UserReqDTO userReqDTO, MultipartFile avatarFile)
            throws IOException {
        log.info("Update user request for email: {}", email);
        User userDb = findByUsername(email);

        applyUserUpdates(userDb, userReqDTO, avatarFile);

        User updatedUser = userRepository.save(userDb);
        UpdateUserResDTO response = mapToUpdateUserResDTO(updatedUser);

        log.info("User updated successfully: email={}, name={}", response.getEmail(), response.getName());
        return response;
    }

    private void applyUserUpdates(User userDb, UserReqDTO dto, MultipartFile avatarFile) throws IOException {
        Optional.ofNullable(dto.getName())
                .filter(StringUtils::hasText)
                .ifPresent(name -> {
                    log.info("Updating name: {} -> {}", userDb.getName(), name);
                    userDb.setName(name);
                });

        if (StringUtils.hasText(dto.getEmail()) && !dto.getEmail().equalsIgnoreCase(userDb.getEmail())) {
            if (isExistEmail(dto.getEmail())) {
                log.warn("Attempt to update to existing email: {}", dto.getEmail());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already exist");
            }
            log.info("Updating email: {} -> {}", userDb.getEmail(), dto.getEmail());
            userDb.setEmail(dto.getEmail());
        }

        if (StringUtils.hasText(dto.getCurrentPassword()) && StringUtils.hasText(dto.getNewPassword())) {
            log.info("Attempting to update password for: {}", userDb.getEmail());
            if (!passwordEncoder.matches(dto.getCurrentPassword(), userDb.getPassword())) {
                log.warn("Invalid current password for: {}", userDb.getEmail());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is invalid");
            }
            userDb.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        }

        if (avatarFile != null && !avatarFile.isEmpty()) {
            String originalFilename = avatarFile.getOriginalFilename();
            if (originalFilename == null || StringUtils.cleanPath(originalFilename).contains("..")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file name");
            }
            if (StringUtils.hasText(userDb.getAvatarUrl())) {
                uploadCloud.deleteFile(userDb.getAvatarUrl());
            }
            String uploadUrl = uploadCloud.handleSaveUploadFile(avatarFile, "avatar");
            userDb.setAvatarUrl(uploadUrl);
        }
    }

    @Override
    public boolean isExistEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    private UpdateUserResDTO mapToUpdateUserResDTO(User user) {
        return UpdateUserResDTO.builder()
                .email(user.getEmail())
                .name(user.getName())
                .urlAvatar(user.getAvatarUrl())
                .build();
    }

    @Override
    public Page<UserDTO> searchUsers(String keyword, Pageable pageable) {

        return this.userCustomRepo.findAll(UserSpecification.hasName(keyword), pageable, UserDTO.class);
    }

    @Override
    public void changePassword(ChangePassDTO req) {

        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new AppException(400, "Mật khẩu xác nhận không khớp",
                    "Xác nhận mật khẩu không khớp với mật khẩu mới");

        }
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(404, "Người dùng không tồn tại", "Người dùng không tồn tại"));
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPassword())) {
            throw new AppException(400, "Mật khẩu hiện tại không đúng", "Mật khẩu hiện tại không đúng");
        }
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

    }
}
