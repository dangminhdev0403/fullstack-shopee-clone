package com.minh.shopee.services;

import java.io.IOException;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.minh.shopee.domain.dto.request.UserReqDTO;
import com.minh.shopee.domain.dto.request.UserResgisterDTO;
import com.minh.shopee.domain.dto.response.users.UpdateUserResDTO;
import com.minh.shopee.domain.dto.response.users.UserDTO;
import com.minh.shopee.domain.model.User;

public interface UserService {

    User createUser(UserResgisterDTO user);

    User findByUsername(String username);

    <T> T findByUsername(String username, Class<T> type);

    void updateRefreshToken(String email, String refreshToken);

    User findByEmailAndRefreshToken(String email, String refreshToken);

    <T> T findByEmailAndRefreshToken(String email, String refreshToken, Class<T> type);

    UpdateUserResDTO updateProfile(String email, UserReqDTO userReqDTO, MultipartFile avatarFile) throws IOException;

    boolean isExistEmail(String email);

    Page<UserDTO> searchUsers(String keyword, org.springframework.data.domain.Pageable pageable);

    void changePassword(com.minh.shopee.domain.dto.request.ChangePassDTO req);
}